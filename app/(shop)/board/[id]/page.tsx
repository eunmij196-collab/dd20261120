import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { formatBoardDate, getBoardPost } from "@/lib/board";
import { SITE_URL } from "@/lib/site";
import { DeleteMyPostForm } from "../BoardForms";

export async function generateMetadata({ params }: PageProps<"/board/[id]">): Promise<Metadata> {
  const { id } = await params;
  const post = await getBoardPost(id);
  if (!post) return { title: "글을 찾을 수 없습니다 | 경남명품향토몰" };
  return {
    metadataBase: new URL(SITE_URL),
    title: `${post.title} | 고객 게시판`,
    description: post.content.replace(/\s+/g, " ").slice(0, 120),
    alternates: { canonical: `/board/${post.id}` },
  };
}

async function PostView({ params }: { params: PageProps<"/board/[id]">["params"] }) {
  const { id } = await params;
  const post = await getBoardPost(id);
  if (!post) notFound();

  return (
    <>
      <article className="bg-surface-container-lowest border border-hanji rounded-lg">
        <header className="px-4 md:px-6 py-4 border-b border-hanji">
          <h1 className="font-headline-md text-headline-md text-primary break-words">{post.title}</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {post.author} · {formatBoardDate(post.createdAt)}
          </p>
        </header>
        <p className="px-4 md:px-6 py-5 font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line break-words">
          {post.content}
        </p>
      </article>
      <Link
        href={`/board/${post.id}/edit`}
        className="self-end inline-flex items-center gap-1 h-12 px-4 rounded-lg border border-hanji bg-surface-container-lowest font-label-md text-label-md text-on-surface hover:border-primary-container"
      >
        <span className="material-symbols-outlined text-[18px]">edit</span>
        내 글 수정하기
      </Link>
      <DeleteMyPostForm id={post.id} />
    </>
  );
}

export default function BoardPostPage({ params }: PageProps<"/board/[id]">) {
  return (
    <div className="px-margin-mobile max-w-3xl mx-auto pt-space-md flex flex-col gap-space-md">
      <Suspense fallback={<p className="text-on-surface-variant py-16 text-center">불러오는 중…</p>}>
        <PostView params={params} />
      </Suspense>
      <Link
        href="/board"
        className="self-start inline-flex items-center gap-1 font-label-md text-label-md text-secondary hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        게시판 목록
      </Link>
    </div>
  );
}
