import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AdminNav from "../_components/AdminNav";
import { logout } from "../actions";

export const metadata: Metadata = {
  title: { default: "관리자 · 경남명품향토몰", template: "%s · 관리자" },
  robots: { index: false, follow: false },
};

const sideLink =
  "flex items-center gap-2.5 px-3 h-12 rounded-lg text-inverse-primary font-label-md text-label-md hover:bg-white/5 hover:text-background";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col md:flex-row bg-background min-h-screen">
      {/* 왼쪽 메뉴 (모바일에서는 위쪽) — 먹색 바탕 + 황동 강조 */}
      <aside className="md:w-60 md:shrink-0 bg-primary-container text-background p-3 md:p-4 flex flex-col gap-3 md:gap-6 md:sticky md:top-0 md:h-screen">
        <div className="flex items-center justify-between gap-2 md:pb-4 md:border-b md:border-white/10">
          <Link href="/admin" className="flex items-center gap-2.5 px-1">
            <span className="w-9 h-9 shrink-0 rounded-[0.125rem] border border-[#c5a059] text-[#c5a059] flex items-center justify-center font-headline-md text-[15px]">
              향
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-headline-md text-[17px] text-background">경남명품향토몰</span>
              <span className="font-label-sm text-[12px] text-secondary-fixed-dim">관리자</span>
            </span>
          </Link>
          <div className="flex md:hidden items-center gap-1">
            <Link href="/" className="h-10 px-2 inline-flex items-center rounded-lg text-inverse-primary font-label-sm text-label-sm">
              쇼핑몰
            </Link>
            <form action={logout}>
              <button className="h-10 px-2 rounded-lg text-inverse-primary font-label-sm text-label-sm">로그아웃</button>
            </form>
          </div>
        </div>
        <Suspense>
          <AdminNav />
        </Suspense>
        <div className="hidden md:flex mt-auto flex-col gap-1 pt-4 border-t border-white/10">
          <Link href="/" className={sideLink}>
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            쇼핑몰 보기
          </Link>
          <form action={logout}>
            <button className={sideLink + " w-full"}>
              <span className="material-symbols-outlined text-[20px]">logout</span>
              로그아웃
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 min-w-0 px-margin-mobile md:px-10 py-space-lg md:py-10">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<p className="text-on-surface-variant">불러오는 중…</p>}>{children}</Suspense>
        </div>
      </main>
    </div>
  );
}
