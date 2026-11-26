/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate, getPublishedPosts, postSummary } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "블로그 | 경남명품향토몰",
  description: "경남 산지 이야기, 제철 특산물 소식, 선물 고르는 팁을 전합니다.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="px-margin-mobile max-w-3xl mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-primary mt-space-md">블로그</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-space-lg">
        경남 산지 이야기와 제철 특산물 소식을 전합니다.
      </p>

      {posts.length === 0 ? (
        <p className="text-on-surface-variant py-16 text-center">아직 올라온 글이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/blog/${p.id}`}
                className="flex gap-3 bg-surface-container-lowest rounded-2xl shadow-sm p-3 hover:shadow-md transition-shadow"
              >
                {p.coverUrl && (
                  <img src={p.coverUrl} alt="" className="w-24 h-24 md:w-36 md:h-24 shrink-0 rounded-xl object-cover" />
                )}
                <div className="min-w-0 flex flex-col gap-1">
                  <h2 className="font-label-md text-label-md text-on-surface line-clamp-2">{p.title}</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    {postSummary(p, 120)}
                  </p>
                  <p className="font-label-sm text-[12px] text-outline mt-auto">{formatPostDate(p.publishedAt)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
