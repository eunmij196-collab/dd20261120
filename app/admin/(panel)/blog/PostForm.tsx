"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useActionState, useState } from "react";
import { savePost } from "../../blog-actions";
import type { Post } from "@/lib/blog";
import { btnPrimary, btnSecondary, inputClass } from "../../_components/ui";

function Field({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-label-md text-label-md text-on-surface">{label}</span>
      {children}
      {hint && <span className="font-body-sm text-[12px] text-outline">{hint}</span>}
    </label>
  );
}

const isImageUrl = (u: string) => /^https?:\/\//i.test(u) || /^\/[^/]/.test(u);

export default function PostForm({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(savePost, undefined);
  const [coverUrl, setCoverUrl] = useState(post?.coverUrl ?? "");

  return (
    <form action={action} className="flex flex-col gap-4">
      {post && <input type="hidden" name="id" value={post.id} />}

      <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-4 md:p-5 flex flex-col gap-4">
        <Field label="제목 *">
          <input name="title" required maxLength={120} defaultValue={post?.title} className={inputClass} />
        </Field>
        <Field label="요약" hint="목록과 검색 결과에 보이는 한두 문장입니다. 비워 두면 본문 앞부분이 쓰입니다.">
          <textarea
            name="excerpt"
            rows={2}
            maxLength={300}
            defaultValue={post?.excerpt}
            className={inputClass + " h-auto py-2"}
          />
        </Field>
        <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
          <Field label="대표 사진 주소 (URL)" hint="예: https://… 또는 /products/gn4-set.jpg">
            <input
              name="coverUrl"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://…"
              className={inputClass}
            />
          </Field>
          <div className="w-full md:w-32 aspect-[16/10] rounded-lg overflow-hidden bg-surface-container flex items-center justify-center">
            {isImageUrl(coverUrl.trim()) ? (
              <img src={coverUrl.trim()} alt="미리보기" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-outline">image</span>
            )}
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-4 md:p-5 flex flex-col gap-2">
        <Field
          label="본문 *"
          hint={
            <>
              빈 줄 = 문단 나눔 · <code>## 소제목</code> · <code>- 목록</code> · <code>![사진 설명](사진주소)</code> = 사진
            </>
          }
        >
          <textarea
            name="content"
            required
            rows={18}
            defaultValue={post?.content}
            className={inputClass + " h-auto py-2 leading-relaxed"}
          />
        </Field>
      </section>

      <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-4 md:p-5">
        <fieldset className="flex flex-wrap items-center gap-4">
          <legend className="sr-only">공개 상태</legend>
          <label className="inline-flex items-center gap-1.5">
            <input
              type="radio"
              name="status"
              value="draft"
              defaultChecked={post?.status !== "published"}
              className="accent-secondary"
            />
            <span className="font-label-md text-label-md">임시저장 (관리자만 보기)</span>
          </label>
          <label className="inline-flex items-center gap-1.5">
            <input
              type="radio"
              name="status"
              value="published"
              defaultChecked={post?.status === "published"}
              className="accent-secondary"
            />
            <span className="font-label-md text-label-md">공개 (쇼핑몰 블로그에 게시)</span>
          </label>
        </fieldset>
      </section>

      {state?.error && (
        <p role="alert" className="px-3 py-2 rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm">
          {state.error}
        </p>
      )}

      <div className="flex gap-2 justify-end">
        <Link href="/admin/blog" className={btnSecondary}>
          취소
        </Link>
        <button disabled={pending} className={btnPrimary}>
          {pending ? "저장 중…" : post ? "변경사항 저장" : "글 저장"}
        </button>
      </div>
    </form>
  );
}
