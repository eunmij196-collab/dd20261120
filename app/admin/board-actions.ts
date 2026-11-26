"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { BOARD_TAG, deleteBoardPostAsAdmin } from "@/lib/board";
import { discordConfigured, sendDiscord } from "@/lib/notify";
import { SITE_URL } from "@/lib/site";

/** 관리자는 손님 비밀번호 없이 게시글을 지울 수 있습니다. (확인 창은 화면에서 띄움) */
export async function adminDeleteBoardPost(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "").trim();
  if (!id) return;
  await deleteBoardPostAsAdmin(id);
  revalidatePath("/admin/board");
  updateTag(BOARD_TAG); // 쇼핑몰 게시판 화면도 새로 고침
}

export type TestNotifyState = { ok?: boolean; message?: string } | undefined;

/** 디스코드 알림이 제대로 가는지 시험 메시지를 보냅니다. */
export async function sendTestNotification(): Promise<TestNotifyState> {
  await requireAdmin();
  if (!discordConfigured()) {
    return { ok: false, message: "디스코드 웹후크 주소(DISCORD_WEBHOOK_URL)가 설정되지 않았습니다." };
  }
  const ok = await sendDiscord("✅ 알림 시험입니다. 이 메시지가 보이면 디스코드 알림이 잘 연결된 것입니다.", {
    title: "경남명품향토몰 관리자",
    url: `${SITE_URL}/admin/board`,
    description: "고객 게시판에 새 글이 올라오면 이 채널로 알려 드립니다.",
  });
  return ok
    ? { ok: true, message: "시험 메시지를 보냈습니다. 디스코드 채널을 확인해 보세요." }
    : { ok: false, message: "보내지 못했습니다. 웹후크 주소가 맞는지, 웹후크가 삭제되지 않았는지 확인하세요." };
}
