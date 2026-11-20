import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "관리자 로그인 · 경남명품향토몰",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-margin-mobile py-space-xl bg-surface-container-low">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="material-symbols-outlined text-secondary text-[32px]">admin_panel_settings</span>
          <h1 className="font-headline-lg text-headline-lg text-primary">관리자 로그인</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">경남명품향토몰 운영 관리</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
