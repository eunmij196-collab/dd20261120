import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getPostById } from "@/lib/blog";
import { removePost } from "../../../blog-actions";
import ConfirmButton from "../../../_components/ConfirmButton";
import PostForm from "../PostForm";
import { PageTitle, btnSecondary } from "../../../_components/ui";

export const metadata: Metadata = { title: "글 수정" };

export default async function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <>
      <PageTitle title="글 수정" desc={post.title}>
        <div className="flex gap-2">
          {post.status === "published" && (
            <Link href={`/blog/${post.id}`} target="_blank" className={btnSecondary}>
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              글 보기
            </Link>
          )}
          <form action={removePost}>
            <input type="hidden" name="id" value={post.id} />
            <ConfirmButton
              message={`'${post.title}' 글을 삭제할까요? 되돌릴 수 없습니다.`}
              className="h-10 px-4 rounded-lg text-error font-label-md text-label-md hover:bg-error-container"
            >
              글 삭제
            </ConfirmButton>
          </form>
        </div>
      </PageTitle>
      <PostForm post={post} />
    </>
  );
}
