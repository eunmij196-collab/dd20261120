import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BOARD_PAGE_SIZE, formatBoardDate, getBoardPage } from "@/lib/board";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "고객 게시판 | 경남명품향토몰",
  description: "상품 문의, 선물 후기, 단체 주문 문의를 자유롭게 남겨 주세요.",
  alternates: { canonical: "/board" },
};

async function BoardList({ searchParams }: { searchParams: PageProps<"/board">["searchParams"] }) {
  const sp = await searchParams;
  const page = Math.max(1, Math.floor(Number(sp.page) || 1));
  const { posts, total } = await getBoardPage(page);
  const pages = Math.max(1, Math.ceil(total / BOARD_PAGE_SIZE));

  return (
    <>
      {posts.length === 0 ? (
        <div className="bg-surface-container-lowest border border-hanji rounded-lg py-16 text-center text-on-surface-variant">
          {page === 1 ? "아직 올라온 글이 없습니다. 첫 글을 남겨 주세요." : "이 페이지에는 글이 없습니다."}
        </div>
      ) : (
        <ul className="bg-surface-container-lowest border border-hanji rounded-lg divide-y divide-hanji">
          {posts.map((p, i) => (
            <li key={p.id}>
              <Link href={`/board/${p.id}`} className="flex items-center gap-3 px-4 py-3 min-h-14 hover:bg-surface-container-low">
                <span className="hidden sm:block w-10 shrink-0 text-center font-label-sm text-label-sm text-outline tabular-nums">
                  {total - (page - 1) * BOARD_PAGE_SIZE - i}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-label-lg text-label-lg text-on-surface truncate">{p.title}</span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant">
                    {p.author} · {formatBoardDate(p.createdAt)}
                  </span>
                </span>
                <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label="페이지" className="flex justify-center gap-1 mt-space-md">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={n === 1 ? "/board" : `/board?page=${n}`}
              aria-current={n === page ? "page" : undefined}
              className={
                "w-11 h-11 inline-flex items-center justify-center rounded-lg border font-label-md text-label-md " +
                (n === page
                  ? "bg-primary-container border-primary-container text-background"
                  : "bg-surface-container-lowest border-hanji text-primary-container")
              }
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}

export default function BoardPage({ searchParams }: PageProps<"/board">) {
  return (
    <div className="px-margin-mobile max-w-3xl mx-auto">
      <div className="flex items-end justify-between gap-3 mt-space-md mb-space-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">고객 게시판</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            상품 문의, 선물 후기, 단체 주문 문의를 남겨 주세요.
          </p>
        </div>
        <Link
          href="/board/write"
          className="shrink-0 inline-flex items-center gap-1 h-12 px-4 rounded-lg bg-primary-container text-background font-label-lg text-label-lg"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          글쓰기
        </Link>
      </div>
      <Suspense fallback={<p className="text-on-surface-variant py-16 text-center">불러오는 중…</p>}>
        <BoardList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
