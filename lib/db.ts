// 관리자 데이터 저장소.
// - Vercel에 Upstash Redis가 연결되어 있으면(환경변수 KV_REST_API_URL 등) Redis에 저장합니다.
// - 없으면 내 컴퓨터의 data/db.json 파일에 저장합니다 (개발용).
import { promises as fs } from "fs";
import path from "path";
import type { Db } from "./types";
import { createSeed } from "./seed";

const REDIS_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_KEY = "gyeongnam-mall:db";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "db.json");

// ── Redis (Upstash REST API) ──────────────────────────

async function redis<T>(command: (string | number)[]): Promise<T> {
  const res = await fetch(REDIS_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const json = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || json.error) throw new Error(`Redis 오류: ${json.error ?? res.status}`);
  return json.result as T;
}

/** 예전 저장소(Redis)가 연결되어 있는지 (실제 사이트에서만 true) */
export function redisConfigured() {
  return Boolean(REDIS_URL && REDIS_TOKEN);
}

// ── 읽기·쓰기 ─────────────────────────────────────────

async function rawRead(): Promise<string | null> {
  if (REDIS_URL && REDIS_TOKEN) return redis<string | null>(["GET", REDIS_KEY]);
  if (process.env.VERCEL) {
    throw new Error(
      "Vercel에서는 파일에 저장할 수 없습니다. Vercel 대시보드 → Storage 에서 Upstash Redis를 만들어 이 프로젝트에 연결한 뒤 다시 배포하세요.",
    );
  }
  try {
    return await fs.readFile(DB_PATH, "utf8");
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

async function save(db: Db) {
  const text = JSON.stringify(db, null, 2);
  if (REDIS_URL && REDIS_TOKEN) {
    await redis(["SET", REDIS_KEY, text]);
    return;
  }
  await fs.mkdir(DB_DIR, { recursive: true });
  const tmp = `${DB_PATH}.tmp`;
  await fs.writeFile(tmp, text, "utf8");
  await fs.rename(tmp, DB_PATH);
}

async function load(): Promise<Db> {
  const text = await rawRead();
  if (text) return JSON.parse(text) as Db;
  // 처음 실행: 현재 홈페이지 상품과 샘플 주문으로 시작
  const seed = createSeed();
  await save(seed);
  return seed;
}

// 한 서버 안에서 동시에 저장할 때 덮어쓰지 않도록 쓰기를 한 줄로 세웁니다.
let writeQueue: Promise<unknown> = Promise.resolve();

export async function readDb(): Promise<Db> {
  await writeQueue.catch(() => {});
  return load();
}

/** db를 읽어 fn으로 수정한 뒤 저장합니다. fn의 반환값을 돌려줍니다. */
export function updateDb<T>(fn: (db: Db) => T): Promise<T> {
  const run = writeQueue
    .catch(() => {})
    .then(async () => {
      const db = await load();
      const result = fn(db);
      await save(db);
      return result;
    });
  writeQueue = run;
  return run;
}
