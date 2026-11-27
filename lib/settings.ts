// 사이트 설정 (Turso app_meta 테이블에 key/value 로 저장). 서버에서만 사용합니다.
// 관리자 화면에서 바꾸면 SETTINGS_TAG 가 갱신되어 쇼핑몰 화면에 바로 반영됩니다.
import { cacheLife, cacheTag } from "next/cache";
import { execute } from "./turso";

export const SETTINGS_TAG = "settings";

const PAYMENTS_KEY = "payments_enabled";

async function ensureTable() {
  await execute([{ sql: "CREATE TABLE IF NOT EXISTS app_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)" }]);
}

async function cachedPaymentsEnabled(): Promise<boolean> {
  "use cache";
  cacheTag(SETTINGS_TAG);
  cacheLife("hours");
  return paymentsEnabledFresh(); // 오류는 캐시되지 않고 밖으로 던져집니다
}

/** 온라인 결제 켜짐 여부 (화면 표시용, 캐시). 설정한 적이 없으면 켜짐. 읽지 못하면 안전하게 꺼짐. */
export async function paymentsEnabled(): Promise<boolean> {
  try {
    return await cachedPaymentsEnabled();
  } catch (e) {
    console.error("결제 설정을 읽지 못했습니다:", e);
    return false;
  }
}

/** 캐시 없이 바로 읽기 (주문을 받을 때 서버에서 확인용) */
export async function paymentsEnabledFresh(): Promise<boolean> {
  await ensureTable();
  const [rows] = await execute([{ sql: "SELECT value FROM app_meta WHERE key = ?", args: [PAYMENTS_KEY] }]);
  return rows.length === 0 ? true : rows[0].value === "on";
}

export async function setPaymentsEnabled(on: boolean) {
  await ensureTable();
  await execute([
    {
      sql: "INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      args: [PAYMENTS_KEY, on ? "on" : "off"],
    },
  ]);
}
