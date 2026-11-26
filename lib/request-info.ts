// 요청한 사람의 접속 정보 (알림·보안 기록용). 서버에서만 사용합니다.
import { createHash } from "crypto";
import { headers } from "next/headers";

export type RequestInfo = { ip: string; place: string; device: string };

function decode(v: string | null) {
  if (!v) return "";
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

/** 브라우저 정보에서 기기·브라우저 이름만 짧게 뽑습니다. */
function shortDevice(ua: string) {
  const os = /Windows/.test(ua)
    ? "Windows"
    : /iPhone|iPad/.test(ua)
      ? "iPhone/iPad"
      : /Android/.test(ua)
        ? "Android"
        : /Mac OS X/.test(ua)
          ? "Mac"
          : /Linux/.test(ua)
            ? "Linux"
            : "알 수 없는 기기";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /SamsungBrowser/.test(ua)
      ? "삼성 인터넷"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Safari\//.test(ua)
          ? "Safari"
          : /Firefox\//.test(ua)
            ? "Firefox"
            : "기타 브라우저";
  return `${os} · ${browser}`;
}

export async function requestInfo(): Promise<RequestInfo> {
  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "알 수 없음";
  // Vercel이 붙여 주는 대략적인 위치 (내 컴퓨터에서 실행할 때는 없음)
  const place = [decode(h.get("x-vercel-ip-city")), h.get("x-vercel-ip-country") ?? ""].filter(Boolean).join(", ");
  return { ip, place: place || "위치 정보 없음", device: shortDevice(h.get("user-agent") ?? "") };
}

export function hashKey(prefix: string, value: string) {
  return createHash("sha256").update(`${prefix}:${value}`).digest("hex").slice(0, 32);
}
