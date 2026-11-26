import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatBoardDate, listBoardPostsForAdmin, type BoardPost } from "@/lib/board";
import { tursoConfigured } from "@/lib/turso";
import { adminDeleteBoardPost } from "../../board-actions";
import ConfirmButton from "../../_components/ConfirmButton";
import TestNotifyButton from "../../_components/TestNotifyButton";
import { discordConfigured } from "@/lib/notify";
import { EmptyState, ErrorNotice, PageTitle, btnSecondary, btnSmallDanger, cardClass } from "../../_components/ui";

export const metadata: Metadata = { title: "게시판 관리" };

const LIMIT = 200;

export default async function BoardAdminPage() {
  await requireAdmin();

  let posts: BoardPost[] = [];
  let total = 0;
  let error = "";
  if (!tursoConfigured()) {
    error = "Turso 데이터베이스가 연결되지 않았습니다. TURSO_DATABASE_URL / TURSO_AUTH_TOKEN 환경변수를 확인하세요.";
  } else {
    try {
      ({ posts, total } = await listBoardPostsForAdmin(LIMIT));
    } catch (e) {
      console.error(e);
      error = "게시판 글을 불러오지 못했습니다. Turso 연결 정보(URL·토큰)를 확인하세요.";
    }
  }

  return (
    <>
      <PageTitle
        title="게시판 관리"
        desc={`손님 글 ${total}개${total > LIMIT ? ` · 최근 ${LIMIT}개 표시` : ""} · 관리자는 비밀번호 없이 삭제할 수 있습니다`}
      >
        <div className="flex flex-col md:flex-row md:items-start gap-3">
          <TestNotifyButton configured={discordConfigured()} />
          <Link href="/board" target="_blank" className={btnSecondary}>
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            게시판 보기
          </Link>
        </div>
      </PageTitle>

      {error ? (
        <ErrorNotice>{error}</ErrorNotice>
      ) : posts.length === 0 ? (
        <EmptyState icon="forum">아직 손님이 쓴 글이 없습니다.</EmptyState>
      ) : (
        <ul className={`${cardClass} divide-y divide-hanji`}>
          {posts.map((p) => (
            <li key={p.id} className="p-3 md:p-4 flex flex-col md:flex-row md:items-start gap-3">
              <details className="flex-1 min-w-0 group">
                <summary className="cursor-pointer list-none flex flex-col gap-0.5">
                  <span className="flex items-center gap-1.5 font-label-lg text-label-lg text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-outline transition-transform group-open:rotate-90">
                      chevron_right
                    </span>
                    <span className="truncate">{p.title}</span>
                  </span>
                  <span className="pl-6 font-body-sm text-body-sm text-on-surface-variant">
                    {p.author} · {formatBoardDate(p.createdAt)}
                  </span>
                </summary>
                <p className="mt-2 ml-6 p-3 rounded-lg bg-surface-container-low border border-hanji font-body-md text-body-md text-on-surface whitespace-pre-line break-words">
                  {p.content}
                </p>
              </details>
              <div className="flex gap-1.5 shrink-0 justify-end">
                <Link href={`/board/${p.id}`} target="_blank" className="inline-flex items-center justify-center h-10 px-3 rounded-lg border border-hanji font-label-md text-label-md text-on-surface hover:border-primary-container">
                  보기
                </Link>
                <form action={adminDeleteBoardPost}>
                  <input type="hidden" name="id" value={p.id} />
                  <ConfirmButton
                    message={`'${p.title}' (${p.author}) 글을 삭제할까요?\n삭제하면 되돌릴 수 없습니다.`}
                    className={btnSmallDanger}
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    삭제
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
