import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AdminNav from "../_components/AdminNav";
import { logout } from "../actions";

export const metadata: Metadata = {
  title: { default: "관리자 · 경남명품향토몰", template: "%s · 관리자" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col md:flex-row bg-surface-container-low min-h-screen">
      <aside className="md:w-56 md:shrink-0 bg-surface-container-lowest border-b md:border-b-0 md:border-r border-outline-variant/50 p-3 md:p-4 flex flex-col gap-3 md:sticky md:top-0 md:h-screen">
        <div className="flex items-center justify-between gap-2">
          <Link href="/admin" className="font-headline-md text-headline-md text-primary">
            향토몰 관리자
          </Link>
          <div className="flex md:hidden items-center gap-1">
            <Link
              href="/"
              className="h-9 px-2 inline-flex items-center rounded-lg text-on-surface-variant font-label-sm text-label-sm"
            >
              쇼핑몰
            </Link>
            <form action={logout}>
              <button className="h-9 px-2 rounded-lg text-on-surface-variant font-label-sm text-label-sm">로그아웃</button>
            </form>
          </div>
        </div>
        <Suspense>
          <AdminNav />
        </Suspense>
        <div className="hidden md:flex mt-auto flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 h-10 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            쇼핑몰 보기
          </Link>
          <form action={logout}>
            <button className="w-full flex items-center gap-2 px-3 h-10 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              로그아웃
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 min-w-0 px-margin-mobile md:px-8 py-space-lg md:py-8">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<p className="text-on-surface-variant">불러오는 중…</p>}>{children}</Suspense>
        </div>
      </main>
    </div>
  );
}
