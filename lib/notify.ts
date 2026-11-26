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

const RED = 0xba1a1a; // 경고 (DESIGN.md error)
const NAVY = 0x1c2331; // 일반 (DESIGN.md primary)

type Who = { ip: string; place: string; device: string };
const whoFields = (w: Who) => [
  { name: "접속 주소", value: w.ip, inline: true },
  { name: "위치(대략)", value: w.place, inline: true },
  { name: "기기", value: w.device, inline: true },
];

export function notifyBoardPostEdited(post: { id: string; author: string; title: string; content: string }) {
  notifyLater("✏️ 고객 게시판 글이 수정되었습니다.", {
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

export function notifyBoardPostDeleted(post: { author: string; title: string }) {
  notifyLater("🗑️ 고객이 자기 게시판 글을 삭제했습니다.", {
    title: cut(post.title, 200),
    color: NAVY,
    fields: [{ name: "작성자", value: cut(post.author, 50), inline: true }],
    timestamp: new Date().toISOString(),
  });
}

export function notifyBlogPublished(post: { id: string; title: string; summary: string }) {
  notifyLater("📢 블로그에 새 글이 공개되었습니다.", {
    title: cut(post.title, 200),
    url: `${SITE_URL}/blog/${post.id}`,
    description: cut(post.summary, 300),
    timestamp: new Date().toISOString(),
  });
}

export function notifyAdminLogin(who: Who) {
  notifyLater("🔐 관리자 화면에 로그인했습니다. 본인이 아니라면 바로 관리자 비밀번호를 바꾸세요.", {
    title: "관리자 로그인",
    url: `${SITE_URL}/admin`,
    color: NAVY,
    fields: whoFields(who),
    timestamp: new Date().toISOString(),
  });
}

export function notifyLoginFailures(who: Who, count: number, locked: boolean) {
  notifyLater(
    locked
      ? `🚨 관리자 비밀번호를 ${count}번 틀려 이 접속 주소의 로그인을 잠시 막았습니다.`
      : `⚠️ 관리자 비밀번호가 ${count}번 틀렸습니다.`,
    {
      title: locked ? "로그인 차단" : "로그인 실패 반복",
      color: RED,
      description: "본인이 아니라면 누군가 관리자 화면에 들어오려는 것일 수 있습니다. 관리자 비밀번호를 길고 어렵게 바꾸세요.",
      fields: whoFields(who),
      timestamp: new Date().toISOString(),
    },
  );
}

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
