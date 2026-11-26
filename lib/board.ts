// 손님 게시판 저장소 (Turso 데이터베이스의 board_posts 테이블)
// - 손님: 이름·비밀번호로 글을 쓰고, 같은 비밀번호로 자기 글을 지웁니다.
// - 관리자: 비밀번호 없이 지울 수 있습니다.
// 비밀번호는 원문을 저장하지 않고 scrypt 해시로만 보관합니다.
import { createHash, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { cacheLife, cacheTag } from "next/cache";
import { execute, tursoConfigured } from "./turso";
export { LIMITS } from "./board-limits";

export const BOARD_TAG = "board";
export const BOARD_PAGE_SIZE = 15;

export type BoardPost = {
  id: string;
  author: string;
  title: string;
  content: string;
  createdAt: string;
};

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS board_posts (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    ip_hash TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  )`,
  "CREATE INDEX IF NOT EXISTS board_posts_created ON board_posts (created_at DESC)",
];

let ready: Promise<unknown> | null = null;
function ensureTable() {
  ready ??= execute(SCHEMA.map((sql) => ({ sql }))).catch((e) => {
    ready = null;
    throw e;
  });
  return ready;
}

const PUBLIC_COLS = "id, author, title, content, created_at";

function toPost(r: Record<string, string | null>): BoardPost {
  return {
    id: r.id ?? "",
    author: r.author ?? "",
    title: r.title ?? "",
    content: r.content ?? "",
    createdAt: r.created_at ?? "",
  };
}

async function hashPassword(pw: string) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(pw, salt, 32);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

async function verifyPassword(pw: string, stored: string) {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(pw, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}

/** 접속 주소는 원문 대신 해시로만 남깁니다 (도배 방지용). */
export function hashIp(ip: string) {
  return createHash("sha256").update(`board:${ip}`).digest("hex").slice(0, 32);
}

// ── 글쓰기·삭제 ───────────────────────────────────────

/** 같은 접속 주소에서 최근 10분 동안 쓴 글 수 */
export async function recentPostCount(ipHash: string) {
  await ensureTable();
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const [rows] = await execute([
    { sql: "SELECT COUNT(*) AS n FROM board_posts WHERE ip_hash = ? AND created_at > ?", args: [ipHash, since] },
  ]);
  return Number(rows[0]?.n ?? 0);
}

export async function createBoardPost(input: { author: string; title: string; content: string; password: string; ipHash: string }) {
  await ensureTable();
  const id = `q${Date.now().toString(36)}${randomBytes(2).toString("hex")}`;
  await execute([
    {
      sql: "INSERT INTO board_posts (id, author, title, content, password_hash, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [id, input.author, input.title, input.content, await hashPassword(input.password), input.ipHash, new Date().toISOString()],
    },
  ]);
  return id;
}

/** 손님 삭제: 비밀번호가 맞을 때만 지웁니다. 결과: "deleted" | "wrong" | "missing" */
export async function deleteBoardPostWithPassword(id: string, password: string) {
  await ensureTable();
  const [rows] = await execute([{ sql: "SELECT password_hash FROM board_posts WHERE id = ?", args: [id] }]);
  const stored = rows[0]?.password_hash;
  if (!stored) return "missing" as const;
  if (!(await verifyPassword(password, stored))) return "wrong" as const;
  await execute([{ sql: "DELETE FROM board_posts WHERE id = ?", args: [id] }]);
  return "deleted" as const;
}

/** 손님 수정: 비밀번호가 맞을 때만 제목·내용을 고칩니다. 결과: "updated" | "wrong" | "missing" */
export async function updateBoardPostWithPassword(id: string, password: string, input: { title: string; content: string }) {
  await ensureTable();
  const [rows] = await execute([{ sql: "SELECT password_hash FROM board_posts WHERE id = ?", args: [id] }]);
  const stored = rows[0]?.password_hash;
  if (!stored) return "missing" as const;
  if (!(await verifyPassword(password, stored))) return "wrong" as const;
  await execute([{ sql: "UPDATE board_posts SET title = ?, content = ? WHERE id = ?", args: [input.title, input.content, id] }]);
  return "updated" as const;
}

/** 관리자 삭제: 비밀번호 확인 없이 지웁니다. 호출 전에 requireAdmin()을 거쳐야 합니다. */
export async function deleteBoardPostAsAdmin(id: string) {
  await ensureTable();
  await execute([{ sql: "DELETE FROM board_posts WHERE id = ?", args: [id] }]);
}

// ── 관리자용 목록 (캐시 없음) ─────────────────────────

export async function listBoardPostsForAdmin(limit = 200) {
  await ensureTable();
  const [rows, count] = await execute([
    { sql: `SELECT ${PUBLIC_COLS} FROM board_posts ORDER BY created_at DESC LIMIT ?`, args: [limit] },
    { sql: "SELECT COUNT(*) AS n FROM board_posts" },
  ]);
  return { posts: rows.map(toPost), total: Number(count[0]?.n ?? 0) };
}

// ── 쇼핑몰(공개 화면)용: 캐시되고, 글이 바뀌면 갱신 ──

export async function getBoardPage(page: number): Promise<{ posts: BoardPost[]; total: number }> {
  "use cache";
  cacheTag(BOARD_TAG);
  cacheLife("hours");
  if (!tursoConfigured()) return { posts: [], total: 0 };
  try {
    await ensureTable();
    const [rows, count] = await execute([
      {
        sql: `SELECT ${PUBLIC_COLS} FROM board_posts ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        args: [BOARD_PAGE_SIZE, (page - 1) * BOARD_PAGE_SIZE],
      },
      { sql: "SELECT COUNT(*) AS n FROM board_posts" },
    ]);
    return { posts: rows.map(toPost), total: Number(count[0]?.n ?? 0) };
  } catch (e) {
    console.error("게시판 글을 불러오지 못했습니다:", e);
    return { posts: [], total: 0 };
  }
}

export async function getBoardPost(id: string): Promise<BoardPost | null> {
  "use cache";
  cacheTag(BOARD_TAG);
  cacheLife("hours");
  if (!tursoConfigured()) return null;
  try {
    await ensureTable();
    const [rows] = await execute([{ sql: `SELECT ${PUBLIC_COLS} FROM board_posts WHERE id = ?`, args: [id] }]);
    return rows[0] ? toPost(rows[0]) : null;
  } catch (e) {
    console.error("게시판 글을 불러오지 못했습니다:", e);
    return null;
  }
}

export function formatBoardDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
