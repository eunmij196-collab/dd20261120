"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { BOARD_TAG, LIMITS, createBoardPost, deleteBoardPostWithPassword, hashIp, recentPostCount } from "@/lib/board";

export type BoardFormState = { error?: string } | undefined;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
// 눈에 안 보이는 제어 문자 제거 (줄바꿈·탭은 유지)
const clean = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");

const MAX_POSTS_PER_10_MIN = 3;

export async function writeBoardPost(_prev: BoardFormState, fd: FormData): Promise<BoardFormState> {
  // 자동 등록 프로그램 차단용 숨은 칸: 사람은 비워 둡니다.
  if (str(fd, "website")) return { error: "등록하지 못했습니다." };

  const author = clean(str(fd, "author"));
  const title = clean(str(fd, "title"));
  const content = clean(String(fd.get("content") ?? "")).trim();
  const password = String(fd.get("password") ?? "");

  if (!author) return { error: "이름을 입력하세요." };
  if (author.length > LIMITS.author) return { error: `이름은 ${LIMITS.author}자 이하로 입력하세요.` };
  if (!title) return { error: "제목을 입력하세요." };
  if (title.length > LIMITS.title) return { error: `제목은 ${LIMITS.title}자 이하로 입력하세요.` };
  if (!content) return { error: "내용을 입력하세요." };
  if (content.length > LIMITS.content) return { error: `내용은 ${LIMITS.content}자 이하로 입력하세요.` };
  if (password.length < LIMITS.passwordMin || password.length > LIMITS.passwordMax) {
    return { error: `비밀번호는 ${LIMITS.passwordMin}~${LIMITS.passwordMax}자로 입력하세요.` };
  }

  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = hashIp(ip);

  let id: string;
  try {
    if ((await recentPostCount(ipHash)) >= MAX_POSTS_PER_10_MIN) {
      return { error: "짧은 시간에 글을 너무 많이 썼습니다. 10분 뒤에 다시 시도해 주세요." };
    }
    id = await createBoardPost({ author, title, content, password, ipHash });
  } catch (e) {
    console.error(e);
    return { error: "글을 등록하지 못했습니다. 잠시 뒤 다시 시도해 주세요." };
  }
  updateTag(BOARD_TAG);
  redirect(`/board/${id}`);
}

export async function deleteMyBoardPost(_prev: BoardFormState, fd: FormData): Promise<BoardFormState> {
  const id = str(fd, "id");
  const password = String(fd.get("password") ?? "");
  if (!password) return { error: "글을 쓸 때 정한 비밀번호를 입력하세요." };

  let result: "deleted" | "wrong" | "missing";
  try {
    result = await deleteBoardPostWithPassword(id, password);
  } catch (e) {
    console.error(e);
    return { error: "삭제하지 못했습니다. 잠시 뒤 다시 시도해 주세요." };
  }
  if (result === "wrong") return { error: "비밀번호가 맞지 않습니다." };
  updateTag(BOARD_TAG);
  redirect("/board");
}
