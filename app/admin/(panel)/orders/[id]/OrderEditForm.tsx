"use client";

import { useActionState } from "react";
import { updateOrder } from "../../../actions";
import { ORDER_STATUSES, statusLabel } from "@/lib/format";
import type { Order } from "@/lib/types";
import { btnPrimary, inputClass } from "../../../_components/ui";

export default function OrderEditForm({ order }: { order: Order }) {
  const [state, action, pending] = useActionState(updateOrder, undefined);
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={order.id} />
      <label className="flex flex-col gap-1.5">
        <span className="font-label-md text-label-md">주문 상태</span>
        <select name="status" defaultValue={order.status} className={inputClass}>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-label-md text-label-md">송장번호 (우체국 특송)</span>
        <input name="trackingNumber" defaultValue={order.trackingNumber} placeholder="예: 6896-1234-5678" className={inputClass} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-label-md text-label-md">관리자 메모</span>
        <textarea name="memo" rows={3} defaultValue={order.memo} placeholder="고객 요청사항, 환불 사유 등" className={inputClass + " h-auto py-2"} />
      </label>
      {state?.error && (
        <p role="alert" className="px-3 py-2 rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm">
          {state.error}
        </p>
      )}
      {state && !state.error && !pending && (
        <p role="status" className="font-body-sm text-body-sm text-secondary">저장했습니다.</p>
      )}
      <button disabled={pending} className={btnPrimary}>
        {pending ? "저장 중…" : "저장"}
      </button>
    </form>
  );
}
