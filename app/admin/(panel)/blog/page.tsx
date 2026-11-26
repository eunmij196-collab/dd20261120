/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatPostDate, listAllPosts, type Post } from "@/lib/blog";
import { tursoConfigured } from "@/lib/turso";
import { removePost, togglePostStatus } from "../../blog-actions";
import ConfirmButton from "../../_components/ConfirmButton";
import {
  EmptyState,
  ErrorNotice,
  PageTitle,
  btnPrimary,
  btnSecondary,
  btnSmall,
  btnSmallDanger,
  cardClass,
} from "../../_components/ui";

export const metadata: Metadata = { title: "블로그 관리" };

export default async function BlogAdminPage() {
  await requireAdmin();

  let posts: Post[] = [];
  let error = "";
  if (!tursoConfigured()) {
    error = "Turso 데이터베이스가 연결되지 않았습니다. TURSO_DATABASE_URL / TURSO_AUTH_TOKEN 환경변수를 확인하세요.";
  } else {
    try {
      posts = await listAllPosts();
    } catch (e) {
      console.error(e);
      error = "블로그 글을 불러오지 못했습니다. Turso 연결 정보(URL·토큰)를 확인하세요.";
    }
  }
  const published = posts.filter((p) => p.status === "published").length;

  return (
    <>
      <PageTitle title="블로그 관리" desc={`전체 ${posts.length}개 · 공개 ${published}개 · 임시저장 ${posts.length - published}개`}>
        <div className="flex gap-2">
          <Link href="/blog" target="_blank" className={btnSecondary}>
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            블로그 보기
          </Link>
          <Link href="/admin/blog/new" className={btnPrimary}>
            <span className="material-symbols-outlined text-[18px]">edit</span>
            글쓰기
          </Link>
        </div>
      </PageTitle>

      {error ? (
        <ErrorNotice>{error}</ErrorNotice>
      ) : posts.length === 0 ? (
        <EmptyState icon="edit_note">
          아직 쓴 글이 없습니다. 오른쪽 위 <b>글쓰기</b>를 눌러 첫 글을 써 보세요.
        </EmptyState>
      ) : (
        <ul className={`${cardClass} divide-y divide-hanji`}>
          {posts.map((p) => (
            <li key={p.id} className="p-3 md:p-4 flex flex-wrap md:flex-nowrap items-center gap-3">
              <div className="w-16 h-16 md:w-20 md:h-14 shrink-0 rounded-lg overflow-hidden bg-surface-container-low border border-hanji flex items-center justify-center">
                {p.coverUrl ? (
                  <img src={p.coverUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-outline">article</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className={
                      "px-1.5 rounded-sm text-[11px] font-semibold " +
                      (p.status === "published"
                        ? "bg-primary-container text-background"
                        : "bg-surface-container-high text-on-surface-variant")
                    }
                  >
                    {p.status === "published" ? "공개" : "임시저장"}
                  </span>
                  <span className="font-label-sm text-[12px] text-outline">
                    {p.status === "published" ? `${formatPostDate(p.publishedAt)} 공개` : `${formatPostDate(p.updatedAt)} 저장`}
                  </span>
                </div>
                <Link
                  href={`/admin/blog/${p.id}`}
                  className="block font-label-lg text-label-lg text-on-surface truncate hover:underline"
                >
                  {p.title}
                </Link>
              </div>
              <div className="flex gap-1.5 shrink-0 w-full md:w-auto justify-end">
                <form action={togglePostStatus}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="status" value={p.status} />
                  <button className={btnSmall} title="공개/임시저장 전환">
                    {p.status === "published" ? "비공개로" : "공개하기"}
                  </button>
                </form>
                <Link href={`/admin/blog/${p.id}`} className={btnSmall}>
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  수정
                </Link>
                <form action={removePost}>
                  <input type="hidden" name="id" value={p.id} />
                  <ConfirmButton
                    message={`'${p.title}' 글을 삭제할까요?\n삭제하면 되돌릴 수 없습니다.`}
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
