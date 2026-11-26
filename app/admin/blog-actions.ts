"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  POSTS_TAG,
  createPost,
  deletePost,
  getPostById,
  postSummary,
  safeImageUrl,
  setPostStatus,
  updatePost,
  type PostStatus,
} from "@/lib/blog";
import { notifyBlogPublished } from "@/lib/notify";

export type PostFormState = { error?: string } | undefined;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

function refresh() {
  revalidatePath("/admin/blog", "layout");
  updateTag(POSTS_TAG); // 쇼핑몰 블로그 화면도 새로 고침
}

export async function savePost(_prev: PostFormState, fd: FormData): Promise<PostFormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const coverRaw = str(fd, "coverUrl");
  const input = {
    title: str(fd, "title"),
    excerpt: str(fd, "excerpt"),
    content: String(fd.get("content") ?? "").replace(/\s+$/, ""),
    coverUrl: safeImageUrl(coverRaw),
    status: (str(fd, "status") === "published" ? "published" : "draft") as PostStatus,
  };
  if (!input.title) return { error: "제목을 입력하세요." };
  if (input.title.length > 120) return { error: "제목은 120자 이하로 입력하세요." };
  if (coverRaw && !input.coverUrl) return { error: "대표 사진 주소는 https:// 또는 /로 시작해야 합니다." };
  if (!input.content.trim()) return { error: "본문을 입력하세요." };

  try {
    if (id) {
      const before = await getPostById(id);
      if (!before || !(await updatePost(id, input))) {
        return { error: "글을 찾을 수 없습니다. 이미 삭제되었을 수 있습니다." };
      }
      // 임시저장 → 공개로 바뀔 때만 알림
      if (before.status !== "published" && input.status === "published") {
        notifyBlogPublished({ id, title: input.title, summary: postSummary(input) });
      }
    } else {
      const newId = await createPost(input);
      if (input.status === "published") {
        notifyBlogPublished({ id: newId, title: input.title, summary: postSummary(input) });
      }
    }
  } catch (e) {
    console.error(e);
    return { error: "저장하지 못했습니다. 데이터베이스(Turso) 연결을 확인하세요." };
  }
  refresh();
  redirect("/admin/blog");
}

/** 공개 ↔ 임시저장 전환 */
export async function togglePostStatus(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const next = str(fd, "status") === "published" ? "draft" : "published";
  await setPostStatus(id, next);
  if (next === "published") {
    const post = await getPostById(id);
    if (post) notifyBlogPublished({ id, title: post.title, summary: postSummary(post) });
  }
  refresh();
}

export async function removePost(fd: FormData) {
  await requireAdmin();
  await deletePost(str(fd, "id"));
  refresh();
  redirect("/admin/blog");
}
