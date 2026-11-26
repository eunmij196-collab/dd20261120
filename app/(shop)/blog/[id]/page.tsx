/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PostContent from "@/app/components/PostContent";
import { formatPostDate, getPublishedPost, postSummary } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/blog/[id]">): Promise<Metadata> {
  const { id } = await params;
  const post = await getPublishedPost(id);
  if (!post) return { title: "글을 찾을 수 없습니다 | 경남명품향토몰" };
  const description = postSummary(post);
  return {
    metadataBase: new URL(SITE_URL),
    title: `${post.title} | 경남명품향토몰 블로그`,
    description,
    alternates: { canonical: `/blog/${post.id}` },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      siteName: "경남명품향토몰",
      url: `/blog/${post.id}`,
      title: post.title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverUrl ? [post.coverUrl] : undefined,
    },
  };
}

async function Article({ params }: { params: PageProps<"/blog/[id]">["params"] }) {
  const { id } = await params;
  const post = await getPublishedPost(id);
  if (!post) notFound();

  return (
    <article className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <h1 className="font-headline-lg text-headline-lg text-primary">{post.title}</h1>
        <p className="font-label-sm text-label-sm text-outline">{formatPostDate(post.publishedAt)}</p>
      </header>
      {post.coverUrl && <img src={post.coverUrl} alt="" className="w-full rounded-2xl object-cover" />}
      <PostContent content={post.content} />
    </article>
  );
}

export default function PostPage({ params }: PageProps<"/blog/[id]">) {
  return (
    <div className="px-margin-mobile max-w-3xl mx-auto pt-space-md flex flex-col gap-space-lg">
      <Suspense fallback={<p className="text-on-surface-variant py-16 text-center">불러오는 중…</p>}>
        <Article params={params} />
      </Suspense>
      <Link
        href="/blog"
        className="self-start inline-flex items-center gap-1 font-label-md text-label-md text-secondary hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        블로그 목록
      </Link>
    </div>
  );
}
