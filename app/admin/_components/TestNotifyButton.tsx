"use client";

import { useActionState } from "react";
import { sendTestNotification } from "../board-actions";

/** 관리자 게시판 화면의 "디스코드 알림 시험" 버튼 */
export default function TestNotifyButton({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(sendTestNotification, undefined);
  return (
    <form action={action} className="flex flex-col gap-1.5 items-start md:items-end">
      <div className="flex items-center gap-2">
        <span
          className={
            "inline-flex items-center gap-1 px-2 h-7 rounded-sm font-label-sm text-[12px] font-semibold " +
            (configured ? "bg-primary-container text-background" : "bg-surface-container-high text-on-surface-variant")
          }
        >
          <span className="material-symbols-outlined text-[14px]">{configured ? "notifications_active" : "notifications_off"}</span>
          디스코드 알림 {configured ? "켜짐" : "꺼짐"}
        </span>
        <button
          disabled={pending || !configured}
          className="inline-flex items-center gap-1 h-10 px-3 rounded-lg border border-hanji bg-surface-container-lowest font-label-md text-label-md text-on-surface hover:border-primary-container disabled:opacity-50"
        >
          {pending ? "보내는 중…" : "알림 시험 보내기"}
        </button>
      </div>
      {state?.message && (
        <p role="status" className={"font-body-sm text-body-sm " + (state.ok ? "text-secondary" : "text-error")}>
          {state.message}
        </p>
      )}
    </form>
  );
}
