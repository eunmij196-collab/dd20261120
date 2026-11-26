// 관리자 로그인 실패 기록 (Turso의 login_failures 테이블)
// 같은 접속 주소에서 15분 동안 10번 틀리면 15분간 로그인을 막습니다.
// Turso에 문제가 있어도 로그인 자체는 막히지 않도록, 호출하는 쪽에서 오류를 무시합니다.
import { execute, tursoConfigured } from "./turso";

export const WINDOW_MINUTES = 15;
export const LOCK_AFTER = 10;

const SCHEMA = `CREATE TABLE IF NOT EXISTS login_failures (
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
)`;

let ready: Promise<unknown> | null = null;
function ensureTable() {
  ready ??= execute([
    { sql: SCHEMA },
    { sql: "CREATE INDEX IF NOT EXISTS login_failures_ip ON login_failures (ip_hash, created_at)" },
  ]).catch((e) => {
    ready = null;
    throw e;
  });
  return ready;
}

const since = () => new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

/** 최근 15분 동안 이 접속 주소에서 틀린 횟수 */
export async function recentFailures(ipHash: string) {
  if (!tursoConfigured()) return 0;
  await ensureTable();
  const [rows] = await execute([
    { sql: "SELECT COUNT(*) AS n FROM login_failures WHERE ip_hash = ? AND created_at > ?", args: [ipHash, since()] },
  ]);
  return Number(rows[0]?.n ?? 0);
}

/** 틀린 기록을 남기고, 최근 15분 동안의 횟수를 돌려줍니다. 하루 지난 기록은 지웁니다. */
export async function recordFailure(ipHash: string) {
  if (!tursoConfigured()) return 0;
  await ensureTable();
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [, , rows] = await execute([
    { sql: "DELETE FROM login_failures WHERE created_at < ?", args: [dayAgo] },
    { sql: "INSERT INTO login_failures (ip_hash, created_at) VALUES (?, ?)", args: [ipHash, new Date().toISOString()] },
    { sql: "SELECT COUNT(*) AS n FROM login_failures WHERE ip_hash = ? AND created_at > ?", args: [ipHash, since()] },
  ]);
  return Number(rows[0]?.n ?? 0);
}

/** 로그인에 성공하면 그 접속 주소의 실패 기록을 지웁니다. */
export async function clearFailures(ipHash: string) {
  if (!tursoConfigured()) return;
  await ensureTable();
  await execute([{ sql: "DELETE FROM login_failures WHERE ip_hash = ?", args: [ipHash] }]);
}
