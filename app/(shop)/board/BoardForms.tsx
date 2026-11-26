"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LIMITS } from "@/lib/board-limits";
import { deleteMyBoardPost, writeBoardPost } from "./actions";

const input =
  "h-12 px-3 rounded-lg border border-hanji bg-surface-container-lowest text-on-surface placeholder:text-[#8c827a] focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container";
const primary =
  "inline-flex items-center justify-center gap-1 h-12 px-5 rounded-lg bg-primary-container text-background font-label-lg text-label-lg disabled:opacity-60";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-label-md text-label-md text-on-surface">{label}</span>
      {children}
      {hint && <span className="font-body-sm text-[12px] text-outline">{hint}</span>}
    </label>
  );
}

function ErrorText({ error }: { error?: string }) {
  return error ? (
    <p role="alert" className="px-3 py-2 rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm">
      {error}
    </p>
  ) : null;
}

export function WriteForm() {
  const [state, action, pending] = useActionState(writeBoardPost, undefined);
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="bg-surface-container-lowest border border-hanji rounded-lg p-4 md:p-5 flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="이름 *">
            <input name="author" required maxLength={LIMITS.author} autoComplete="name" className={input} />
          </Field>
          <Field label="비밀번호 *" hint="글을 지울 때 필요합니다.">
            <input
              name="password"
              type="password"
              required
              minLength={LIMITS.passwordMin}
              maxLength={LIMITS.passwordMax}
              autoComplete="new-password"
              className={input}
            />
          </Field>
        </div>
        <Field label="제목 *">
          <input name="title" required maxLength={LIMITS.title} className={input} />
        </Field>
        <Field label="내용 *" hint="전화번호·주소 같은 개인정보는 적지 마세요. 게시판 글은 누구나 볼 수 있습니다.">
          <textarea name="content" required rows={10} maxLength={LIMITS.content} className={input + " h-auto py-2 leading-relaxed"} />
        </Field>
        {/* 자동 등록 방지용 (화면에 보이지 않음) */}
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      </div>
      <ErrorText error={state?.error} />
      <div className="flex gap-2 justify-end">
        <Link
          href="/board"
          className="inline-flex items-center h-12 px-5 rounded-lg border-[1.5px] border-[#c5a059] bg-background text-primary-container font-label-lg text-label-lg"
        >
          취소
        </Link>
        <button disabled={pending} className={primary}>
          {pending ? "등록 중…" : "등록"}
        </button>
      </div>
    </form>
  );
}

export function DeleteMyPostForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(deleteMyBoardPost, undefined);
  return (
    <details className="bg-surface-container-lowest border border-hanji rounded-lg">
      <summary className="cursor-pointer px-4 h-12 flex items-center font-label-md text-label-md text-on-surface-variant">
        내 글 삭제하기
      </summary>
      <form
        action={action}
        onSubmit={(e) => {
          if (!confirm("이 글을 삭제할까요?\n삭제하면 되돌릴 수 없습니다.")) e.preventDefault();
        }}
        className="px-4 pb-4 flex flex-col gap-2"
      >
        <input type="hidden" name="id" value={id} />
        <div className="flex gap-2">
          <input
            name="password"
            type="password"
            required
            placeholder="글을 쓸 때 정한 비밀번호"
            autoComplete="current-password"
            className={input + " flex-1 min-w-0"}
          />
          <button
            disabled={pending}
            className="shrink-0 h-12 px-4 rounded-lg border border-error/40 text-error font-label-lg text-label-lg disabled:opacity-60"
          >
            {pending ? "확인 중…" : "삭제"}
          </button>
        </div>
        <ErrorText error={state?.error} />
      </form>
    </details>
  );
}
