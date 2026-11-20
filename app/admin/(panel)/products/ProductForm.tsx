"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProduct } from "../../actions";
import { TARGETS, targetLabel } from "@/lib/format";
import type { Product } from "@/lib/types";
import { btnPrimary, btnSecondary, inputClass } from "../../_components/ui";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-label-md text-label-md text-on-surface">{label}</span>
      {children}
      {hint && <span className="font-body-sm text-[12px] text-outline">{hint}</span>}
    </label>
  );
}

export default function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");

  return (
    <form action={action} className="flex flex-col gap-4">
      {product && <input type="hidden" name="id" value={product.id} />}

      <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-4 md:p-5 grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Field label="상품명 *">
            <input name="name" required defaultValue={product?.name} className={inputClass} />
          </Field>
        </div>
        <Field label="산지" hint="예: 경남 산청군">
          <input name="region" defaultValue={product?.region} className={inputClass} />
        </Field>
        <Field label="산지 한 줄 소개" hint="예: 지리산 해풍과 청정한 일교차">
          <input name="tagline" defaultValue={product?.tagline} className={inputClass} />
        </Field>
        <div className="md:col-span-2">
          <Field label="상품 설명">
            <textarea
              name="description"
              rows={3}
              defaultValue={product?.description}
              className={inputClass + " h-auto py-2"}
            />
          </Field>
        </div>
        <div className="md:col-span-2 grid md:grid-cols-[1fr_auto] gap-3 items-end">
          <Field label="사진 주소 (URL)">
            <input
              name="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
              className={inputClass}
            />
          </Field>
          <div className="w-full md:w-32 aspect-[16/10] rounded-lg overflow-hidden bg-surface-container flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt="미리보기" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-outline">image</span>
            )}
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-4 md:p-5 grid md:grid-cols-3 gap-4">
        <Field label="판매가 (원) *">
          <input name="price" type="number" min={1} required defaultValue={product?.price} className={inputClass} />
        </Field>
        <Field label="정가 (원)" hint="할인 전 가격. 할인이 없으면 비워 두세요.">
          <input name="originalPrice" type="number" min={1} defaultValue={product?.originalPrice ?? ""} className={inputClass} />
        </Field>
        <Field label="재고 (개) *">
          <input name="stock" type="number" min={0} required defaultValue={product?.stock ?? 0} className={inputClass} />
        </Field>
      </section>

      <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-4 md:p-5 flex flex-col gap-4">
        <Field label="인증·뱃지" hint="쉼표(,)로 구분. 예: 경남도지사 인증, 명인 수작업">
          <input name="badges" defaultValue={product?.badges.join(", ")} className={inputClass} />
        </Field>
        <fieldset className="flex flex-col gap-2">
          <legend className="font-label-md text-label-md text-on-surface mb-1.5">받는 분 추천 대상</legend>
          <div className="flex flex-wrap gap-2">
            {TARGETS.map((t) => (
              <label key={t} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-surface-container cursor-pointer has-[:checked]:bg-primary-container has-[:checked]:text-on-primary">
                <input type="checkbox" name="targets" value={t} defaultChecked={product?.targets.includes(t)} className="sr-only" />
                <span className="font-label-sm text-label-sm">{targetLabel[t]}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="coldChain" defaultChecked={product?.coldChain} className="w-4 h-4 accent-secondary" />
            <span className="font-label-md text-label-md">냉장·냉동 발송 상품</span>
          </label>
          <fieldset className="inline-flex items-center gap-4">
            <legend className="sr-only">판매 상태</legend>
            <label className="inline-flex items-center gap-1.5">
              <input type="radio" name="status" value="active" defaultChecked={product?.status !== "hidden"} className="accent-secondary" />
              <span className="font-label-md text-label-md">판매중</span>
            </label>
            <label className="inline-flex items-center gap-1.5">
              <input type="radio" name="status" value="hidden" defaultChecked={product?.status === "hidden"} className="accent-secondary" />
              <span className="font-label-md text-label-md">숨김</span>
            </label>
          </fieldset>
        </div>
      </section>

      {state?.error && (
        <p role="alert" className="px-3 py-2 rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm">
          {state.error}
        </p>
      )}

      <div className="flex gap-2 justify-end">
        <Link href="/admin/products" className={btnSecondary}>
          취소
        </Link>
        <button disabled={pending} className={btnPrimary}>
          {pending ? "저장 중…" : product ? "변경사항 저장" : "상품 등록"}
        </button>
      </div>
    </form>
  );
}
