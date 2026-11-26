// 디스코드 알림 (웹후크). 환경변수 DISCORD_WEBHOOK_URL 이 없으면 아무것도 하지 않습니다.
// 디스코드 서버 설정 → 연동 → 웹후크 → 새 웹후크 → "웹후크 URL 복사"로 주소를 받습니다.
import { after } from "next/server";
import { SITE_URL } from "./site";

type Embed = {
  title: string;
  url?: string;
  description?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
};

const BRASS = 0xc5a059; // DESIGN.md 황동색

export function discordConfigured() {
  return /\/api\/webhooks\/\d+\/[\w-]+/.test(process.env.DISCORD_WEBHOOK_URL ?? "");
}

const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

/** 디스코드로 바로 보냅니다. 성공 여부를 돌려주고, 실패해도 오류를 던지지 않습니다. */
export async function sendDiscord(content: string, embed?: Embed): Promise<boolean> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url || !discordConfigured()) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "경남명품향토몰 알림",
        content: cut(content, 1900),
        embeds: embed ? [{ color: BRASS, ...embed }] : undefined,
        // 손님이 쓴 글에 @everyone 같은 멘션이 있어도 아무도 호출하지 않도록 막습니다.
        allowed_mentions: { parse: [] },
      }),
      cache: "no-store",
    });
    if (!res.ok) console.error("디스코드 알림 실패:", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (e) {
    console.error("디스코드 알림 실패:", e);
    return false;
  }
}

/** 응답을 먼저 보낸 뒤 알림을 보냅니다 (손님 화면이 느려지지 않도록). */
export function notifyLater(content: string, embed?: Embed) {
  if (!discordConfigured()) return;
  after(() => sendDiscord(content, embed));
}

// ── 알림 종류 ────────────────────────────────────────

export function notifyNewBoardPost(post: { id: string; author: string; title: string; content: string }) {
  notifyLater("📝 고객 게시판에 새 글이 올라왔습니다.", {
    title: cut(post.title, 200),
    url: `${SITE_URL}/board/${post.id}`,
    description: cut(post.content, 300),
    fields: [
      { name: "작성자", value: cut(post.author, 50), inline: true },
      { name: "관리", value: `[게시판 관리 열기](${SITE_URL}/admin/board)`, inline: true },
    ],
    timestamp: new Date().toISOString(),
  });
}
