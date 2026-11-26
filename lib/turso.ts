// Turso(libSQL) 데이터베이스 연결. 서버에서만 사용합니다.
// 접속 정보는 환경변수 TURSO_DATABASE_URL, TURSO_AUTH_TOKEN 에서 읽습니다 (.env.local / Vercel 환경변수).

type Value = string | number | null;
type Cell = { type: string; value?: string };
type Result = { cols: { name: string }[]; rows: Cell[][] };

export function tursoConfigured() {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

function arg(v: Value) {
  if (v === null) return { type: "null" };
  if (typeof v === "number") return { type: "integer", value: String(Math.trunc(v)) };
  return { type: "text", value: v };
}

/** 여러 SQL 문을 한 번에 실행합니다. 하나라도 실패하면 오류를 던집니다. */
export async function execute(stmts: { sql: string; args?: Value[] }[]): Promise<Record<string, string | null>[][]> {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!url || !token) {
    throw new Error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN 환경변수가 설정되지 않았습니다.");
  }
  const res = await fetch(`${url.replace(/^libsql:/, "https:")}/v2/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [
        ...stmts.map((s) => ({ type: "execute", stmt: { sql: s.sql, args: (s.args ?? []).map(arg) } })),
        { type: "close" },
      ],
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Turso 연결 오류 (HTTP ${res.status})`);
  const json = (await res.json()) as {
    results: { type: "ok" | "error"; response?: { result?: Result }; error?: { message: string } }[];
  };
  const out: Record<string, string | null>[][] = [];
  for (const r of json.results.slice(0, stmts.length)) {
    if (r.type === "error") throw new Error(`Turso 오류: ${r.error?.message}`);
    const result = r.response?.result;
    out.push(
      (result?.rows ?? []).map((row) =>
        Object.fromEntries(result!.cols.map((c, i) => [c.name, row[i]?.type === "null" ? null : (row[i]?.value ?? null)])),
      ),
    );
  }
  return out;
}
