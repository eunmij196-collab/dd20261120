"use client";

import { useActionState } from "react";
import { shipOrder } from "../../actions";
import { inputClass } from "../../_components/ui";

export default function ShipForm({ orderId }: { orderId: string }) {
  const [state, action, pending] = useActionState(shipOrder, undefined);
  return (
    <form action={action} className="flex flex-col gap-1">
      <input type="hidden" name="id" value={orderId} />
      <div className="flex gap-1.5">
        <input
          name="trackingNumber"
          required
          placeholder="송장번호"
          aria-label={`${orderId} 송장번호`}
          className={inputClass + " w-full md:w-40 h-9"}
        />
        <button
          disabled={pending}
          className="h-9 px-3 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm whitespace-nowrap disabled:opacity-60"
        >
          {pending ? "처리 중…" : "발송 처리"}
        </button>
      </div>
      {state?.error && <p className="text-error text-[12px]">{state.error}</p>}
    </form>
  );
}
