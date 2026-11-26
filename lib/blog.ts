// 블로그 글 저장소 (Turso 데이터베이스의 posts 테이블)
import { cacheLife, cacheTag } from "next/cache";
import { execute, tursoConfigured } from "./turso";

export const POSTS_TAG = "posts";

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  excerpt: string; // 목록과 검색 결과에 보이는 요약
  content: string; // 본문 (## 소제목, - 목록, ![](사진주소) 지원)
  coverUrl: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

const SCHEMA = `CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  cover_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT
)`;

let ready: Promise<unknown> | null = null;
function ensureTable() {
  ready ??= execute([{ sql: SCHEMA }]).catch((e) => {
    ready = null;
    throw e;
  });
  return ready;
}

const COLS = "id, title, excerpt, content, cover_url, status, created_at, updated_at, published_at";

function toPost(r: Record<string, string | null>): Post {
  return {
    id: r.id ?? "",
    title: r.title ?? "",
    excerpt: r.excerpt ?? "",
    content: r.content ?? "",
    coverUrl: r.cover_url ?? "",
    status: r.status === "published" ? "published" : "draft",
    createdAt: r.created_at ?? "",
    updatedAt: r.updated_at ?? "",
    publishedAt: r.published_at,
  };
}

async function query(sql: string, args: (string | null)[] = []) {
  await ensureTable();
  const [rows] = await execute([{ sql, args }]);
  return rows.map(toPost);
}

// ── 관리자용 (캐시 없음) ──────────────────────────────

export async function listAllPosts() {
  return query(`SELECT ${COLS} FROM posts ORDER BY created_at DESC`);
}

export async function getPostById(id: string) {
  return (await query(`SELECT ${COLS} FROM posts WHERE id = ?`, [id]))[0] ?? null;
}

export type PostInput = Pick<Post, "title" | "excerpt" | "content" | "coverUrl" | "status">;

export async function createPost(input: PostInput) {
  await ensureTable();
  const now = new Date().toISOString();
  const id = `b${Date.now().toString(36)}`;
  await execute([
    {
      sql: `INSERT INTO posts (${COLS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, input.title, input.excerpt, input.content, input.coverUrl, input.status, now, now,
        input.status === "published" ? now : null],
    },
  ]);
  return id;
}

/** 글을 수정합니다. 처음 공개할 때 공개일을 기록합니다. 글이 없으면 false. */
export async function updatePost(id: string, input: PostInput) {
  await ensureTable();
  const now = new Date().toISOString();
  const [rows] = await execute([
    {
      sql: `UPDATE posts SET title = ?, excerpt = ?, content = ?, cover_url = ?, status = ?, updated_at = ?,
              published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, ?) ELSE published_at END
            WHERE id = ? RETURNING id`,
      args: [input.title, input.excerpt, input.content, input.coverUrl, input.status, now, input.status, now, id],
    },
  ]);
  return rows.length > 0;
}

export async function setPostStatus(id: string, status: PostStatus) {
  await ensureTable();
  const now = new Date().toISOString();
  await execute([
    {
      sql: `UPDATE posts SET status = ?, updated_at = ?,
              published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, ?) ELSE published_at END
            WHERE id = ?`,
      args: [status, now, status, now, id],
    },
  ]);
}

export async function deletePost(id: string) {
  await ensureTable();
  await execute([{ sql: "DELETE FROM posts WHERE id = ?", args: [id] }]);
}

// ── 쇼핑몰(공개 화면)용: 캐시되고, 관리자가 저장하면 갱신 ──

export async function getPublishedPosts(): Promise<Post[]> {
  "use cache";
  cacheTag(POSTS_TAG);
  cacheLife("hours");
  if (!tursoConfigured()) return [];
  try {
    return await query(
      `SELECT ${COLS} FROM posts WHERE status = 'published' ORDER BY published_at DESC`,
    );
  } catch (e) {
    console.error("블로그 글을 불러오지 못했습니다:", e);
    return [];
  }
}

export async function getPublishedPost(id: string): Promise<Post | null> {
  "use cache";
  cacheTag(POSTS_TAG);
  cacheLife("hours");
  if (!tursoConfigured()) return null;
  try {
    return (await query(`SELECT ${COLS} FROM posts WHERE id = ? AND status = 'published'`, [id]))[0] ?? null;
  } catch (e) {
    console.error("블로그 글을 불러오지 못했습니다:", e);
    return null;
  }
}

/** 요약이 없을 때 쓰는 본문 앞부분 (사진 표시·소제목 기호 제거) */
export function postSummary(post: Pick<Post, "excerpt" | "content">, max = 160) {
  if (post.excerpt) return post.excerpt;
  return post.content
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/^#+ |^[-*] /gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** 사진 주소로 허용하는 형식: https://… 또는 사이트 내부 경로(/…) */
export function safeImageUrl(url: string) {
  const u = url.trim();
  return /^https?:\/\//i.test(u) || /^\/(?!\/)/.test(u) ? u : "";
}

export function formatPostDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
