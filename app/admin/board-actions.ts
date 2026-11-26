"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { BOARD_TAG, deleteBoardPostAsAdmin } from "@/lib/board";

/** 관리자는 손님 비밀번호 없이 게시글을 지울 수 있습니다. (확인 창은 화면에서 띄움) */
export async function adminDeleteBoardPost(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "").trim();
  if (!id) return;
  await deleteBoardPostAsAdmin(id);
  revalidatePath("/admin/board");
  updateTag(BOARD_TAG); // 쇼핑몰 게시판 화면도 새로 고침
}
