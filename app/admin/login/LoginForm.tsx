"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="font-label-md text-label-md text-on-surface">비밀번호</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="h-11 px-3 rounded-lg border border-outline-variant bg-surface focus:outline-2 focus:outline-secondary"
        />
      </label>
      {state?.error && (
        <p role="alert" className="font-body-sm text-body-sm text-error">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="h-11 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md disabled:opacity-60"
      >
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
