// 관리자 로그인 세션 (서명된 쿠키). 서버에서만 사용합니다.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8시간

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error(".env.local 에 ADMIN_SESSION_SECRET(16자 이상)을 설정하세요.");
  }
  return s;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error(".env.local 에 ADMIN_PASSWORD 를 설정하세요.");
  return safeEqual(input, pw);
}

export async function startSession() {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = String(expires);
  (await cookies()).set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return false;
  return Number(payload) > Date.now();
}

/** 관리자가 아니면 로그인 화면으로 보냅니다. 모든 관리자 페이지·액션 맨 앞에서 호출하세요. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
