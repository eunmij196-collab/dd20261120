/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatPostDate, listAllPosts, type Post } from "@/lib/blog";
import { tursoConfigured } from "@/lib/turso";
import { togglePostStatus } from "../../blog-actions";
import { PageTitle, btnPrimary, btnSecondary } from "../../_components/ui";

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
      <PageTitle title="블로그 관리" desc={`전체 ${posts.length}개 · 공개 ${published}개`}>
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
        <p role="alert" className="px-3 py-2 rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm">
          {error}
        </p>
      ) : posts.length === 0 ? (
        <p className="text-on-surface-variant py-10 text-center">
          아직 쓴 글이 없습니다. 오른쪽 위 <b>글쓰기</b>를 눌러 첫 글을 써 보세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {posts.map((p) => (
            <li key={p.id} className="bg-surface-container-lowest rounded-2xl shadow-sm p-3 flex items-center gap-3">
              <div className="w-16 h-16 md:w-20 md:h-14 shrink-0 rounded-lg overflow-hidden bg-surface-container flex items-center justify-center">
                {p.coverUrl ? (
                  <img src={p.coverUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-outline">article</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/blog/${p.id}`}
                  className="block font-label-md text-label-md text-on-surface truncate hover:underline"
                >
                  {p.title}
                </Link>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {p.status === "published"
                    ? `${formatPostDate(p.publishedAt)} 공개`
                    : `${formatPostDate(p.updatedAt)} 저장`}
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-1.5 shrink-0">
                <form action={togglePostStatus}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="status" value={p.status} />
                  <button
                    className={
                      "h-9 px-3 rounded-lg font-label-sm text-label-sm w-full " +
                      (p.status === "published"
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container text-on-surface-variant")
                    }
                    title="눌러서 공개/임시저장 전환"
                  >
                    {p.status === "published" ? "공개" : "임시저장"}
                  </button>
                </form>
                <Link
                  href={`/admin/blog/${p.id}`}
                  className="h-9 px-3 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm inline-flex items-center justify-center"
                >
                  수정
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
