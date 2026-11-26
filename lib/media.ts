// 관리자가 올린 사진 저장소 (Turso 데이터베이스의 media 테이블)
// 사진 주소는 /media/<id> 이고, 한 번 올린 사진은 바뀌지 않으므로 오래 캐시됩니다.
import { randomBytes } from "crypto";
import { execute } from "./turso";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB (Vercel 요청 크기 제한 4.5MB 안쪽)

const TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
} as const;
export type ImageMime = keyof typeof TYPES;

const SCHEMA = `CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  mime TEXT NOT NULL,
  data BLOB NOT NULL,
  size INTEGER NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
)`;

let ready: Promise<unknown> | null = null;
function ensureTable() {
  ready ??= execute([{ sql: SCHEMA }]).catch((e) => {
    ready = null;
    throw e;
  });
  return ready;
}

/** 파일 앞부분(매직 넘버)으로 실제 사진 형식을 확인합니다. 확장자·브라우저가 알려준 형식은 믿지 않습니다. */
export function detectImageType(b: Uint8Array): ImageMime | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return "image/gif";
  const ascii = (from: number, to: number) => String.fromCharCode(...b.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}

export async function saveImage(bytes: Uint8Array, mime: ImageMime, name: string) {
  await ensureTable();
  const id = `${Date.now().toString(36)}${randomBytes(5).toString("hex")}.${TYPES[mime]}`;
  await execute([
    {
      sql: "INSERT INTO media (id, mime, data, size, name, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      args: [id, mime, bytes, bytes.length, name.slice(0, 200), new Date().toISOString()],
    },
  ]);
  return { id, url: `/media/${id}` };
}

export async function getImage(id: string) {
  if (!/^[0-9a-z]+\.(jpg|png|webp|gif)$/.test(id)) return null;
  await ensureTable();
  const [rows] = await execute([{ sql: "SELECT mime, data FROM media WHERE id = ?", args: [id] }]);
  const row = rows[0];
  if (!row?.data || !row.mime || !(row.mime in TYPES)) return null;
  return { mime: row.mime as ImageMime, bytes: Buffer.from(row.data, "base64") };
}
