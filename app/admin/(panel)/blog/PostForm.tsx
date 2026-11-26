"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { savePost } from "../../blog-actions";
import type { Post } from "@/lib/blog";
import { btnPrimary, btnSecondary, btnSmall, inputClass } from "../../_components/ui";
import { imageFiles, uploadImage } from "../../_components/uploadImage";

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
  const [uploading, setUploading] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [dragging, setDragging] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const bodyInput = useRef<HTMLInputElement>(null);

  async function uploadCover(files: File[]) {
    const file = files[0];
    if (!file) return;
    setUploadError("");
    setUploading("대표 사진 올리는 중…");
    try {
      setCoverUrl(await uploadImage(file));
    } catch (e) {
      setUploadError((e as Error).message);
    } finally {
      setUploading("");
    }
  }

  /** 사진을 올리고, 본문의 커서 위치에 사진 표시(![](주소))를 넣습니다. */
  async function uploadToBody(files: File[]) {
    if (files.length === 0) return;
    setUploadError("");
    const ta = contentRef.current!;
    let at = ta.selectionEnd ?? ta.value.length;
    for (const [i, file] of files.entries()) {
      setUploading(files.length > 1 ? `본문 사진 올리는 중… (${i + 1}/${files.length})` : "본문 사진 올리는 중…");
      try {
        const url = await uploadImage(file);
        const before = ta.value.slice(0, at);
        const lead = before === "" || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
        const text = `${lead}![](${url})\n\n`;
        ta.setRangeText(text, at, at, "end");
        at += text.length;
      } catch (e) {
        setUploadError((e as Error).message);
        break;
      }
    }
    setUploading("");
    ta.focus();
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      {post && <input type="hidden" name="id" value={post.id} />}

      <section className="bg-surface-container-lowest border border-hanji rounded-lg p-4 md:p-5 flex flex-col gap-4">
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

        <div className="flex flex-col gap-1.5">
          <span className="font-label-md text-label-md text-on-surface">대표 사진</span>
          <div className="grid md:grid-cols-[auto_1fr] gap-3 items-start">
            <button
              type="button"
              onClick={() => coverInput.current?.click()}
              disabled={!!uploading}
              className="relative w-full md:w-48 aspect-[16/10] rounded-lg overflow-hidden bg-surface-container-low border border-dashed border-[#c5a059] flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:bg-secondary-fixed/30 disabled:opacity-60"
            >
              {isImageUrl(coverUrl.trim()) ? (
                <>
                  <img src={coverUrl.trim()} alt="대표 사진 미리보기" className="absolute inset-0 w-full h-full object-cover" />
                  <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-sm bg-primary-container/80 text-background text-[12px] font-semibold">
                    바꾸기
                  </span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[28px] text-secondary">add_photo_alternate</span>
                  <span className="font-label-md text-label-md">사진 올리기</span>
                </>
              )}
            </button>
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-1.5">
                <input
                  name="coverUrl"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="또는 사진 주소(URL) 붙여넣기"
                  aria-label="대표 사진 주소"
                  className={inputClass + " flex-1 min-w-0"}
                />
                {coverUrl && (
                  <button type="button" onClick={() => setCoverUrl("")} className={btnSmall + " h-12"}>
                    지우기
                  </button>
                )}
              </div>
              <span className="font-body-sm text-[12px] text-outline">
                블로그 목록과 공유 미리보기에 쓰입니다. JPG·PNG·WEBP·GIF, 큰 사진은 자동으로 줄여서 올립니다.
              </span>
            </div>
          </div>
          <input
            ref={coverInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              uploadCover(imageFiles(e.target.files));
              e.target.value = "";
            }}
          />
        </div>
      </section>

      <section className="bg-surface-container-lowest border border-hanji rounded-lg p-4 md:p-5 flex flex-col gap-2">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <label htmlFor="post-content" className="font-label-md text-label-md text-on-surface">
            본문 *
          </label>
          <button type="button" onClick={() => bodyInput.current?.click()} disabled={!!uploading} className={btnSmall}>
            <span className="material-symbols-outlined text-[18px] text-secondary">add_photo_alternate</span>
            본문에 사진 넣기
          </button>
          <input
            ref={bodyInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              uploadToBody(imageFiles(e.target.files));
              e.target.value = "";
            }}
          />
        </div>
        <textarea
          id="post-content"
          ref={contentRef}
          name="content"
          required
          rows={18}
          defaultValue={post?.content}
          onPaste={(e) => {
            const files = imageFiles(e.clipboardData.files);
            if (files.length) {
              e.preventDefault();
              uploadToBody(files);
            }
          }}
          onDragOver={(e) => {
            if (e.dataTransfer.types.includes("Files")) {
              e.preventDefault();
              setDragging(true);
            }
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            const files = imageFiles(e.dataTransfer.files);
            setDragging(false);
            if (files.length) {
              e.preventDefault();
              uploadToBody(files);
            }
          }}
          className={
            inputClass +
            " h-auto py-2 leading-relaxed" +
            (dragging ? " border-[#c5a059] ring-2 ring-[#c5a059] bg-secondary-fixed/20" : "")
          }
        />
        <span className="font-body-sm text-[12px] text-outline">
          사진은 <b>본문에 사진 넣기</b> 버튼, 복사·붙여넣기(Ctrl+V), 끌어다 놓기로 넣을 수 있습니다. 커서 자리에{" "}
          <code>![](/media/…)</code>가 들어가며, <code>[ ]</code> 안에 쓴 글은 사진 설명으로 보입니다.
          <br />
          빈 줄 = 문단 나눔 · <code>## 소제목</code> · <code>- 목록</code>
        </span>
      </section>

      {(uploading || uploadError) && (
        <p
          role={uploadError ? "alert" : "status"}
          className={
            "px-3 py-2 rounded-lg font-body-sm text-body-sm " +
            (uploadError ? "bg-error-container text-on-error-container" : "bg-secondary-fixed/40 text-on-secondary-fixed-variant")
          }
        >
          {uploadError || uploading}
        </p>
      )}

      <section className="bg-surface-container-lowest border border-hanji rounded-lg p-4 md:p-5">
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
        <button disabled={pending || !!uploading} className={btnPrimary}>
          {uploading ? "사진 올리는 중…" : pending ? "저장 중…" : post ? "변경사항 저장" : "글 저장"}
        </button>
      </div>
    </form>
  );
}
