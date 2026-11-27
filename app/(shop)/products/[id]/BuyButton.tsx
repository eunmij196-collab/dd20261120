"use client";

import { useState } from "react";
import { startCheckout } from "../actions";

// 토스페이먼츠 결제창 SDK (v2) — 필요할 때만 불러옵니다.
type TossPaymentsFn = ((clientKey: string) => {
  payment: (o: { customerKey: string }) => {
    requestPayment: (o: Record<string, unknown>) => Promise<void>;
  };
}) & { ANONYMOUS: string };

declare global {
  interface Window {
    TossPayments?: TossPaymentsFn;
  }
}

let sdkPromise: Promise<TossPaymentsFn> | null = null;
function loadTossSdk() {
  sdkPromise ??= new Promise<TossPaymentsFn>((resolve, reject) => {
    if (window.TossPayments) return resolve(window.TossPayments);
    const s = document.createElement("script");
    s.src = "https://js.tosspayments.com/v2/standard";
    s.onload = () => (window.TossPayments ? resolve(window.TossPayments) : reject(new Error("sdk")));
    s.onerror = () => {
      sdkPromise = null;
      reject(new Error("sdk"));
    };
    document.head.appendChild(s);
  });
  return sdkPromise;
}

export default function BuyButton({
  productId,
  clientKey,
  soldOut,
}: {
  productId: string;
  clientKey: string;
  soldOut: boolean;
}) {
  const [buyerName, setBuyerName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function buy() {
    setError("");
    if (!buyerName.trim()) return setError("주문하시는 분 이름을 입력하세요.");
    if (!clientKey) return setError("결제 설정이 아직 완료되지 않았습니다.");
    setBusy(true);
    try {
      // 1) 서버가 상품 가격으로 주문을 저장
      const res = await startCheckout(productId, buyerName);
      if (!res.ok) return setError(res.error);

      // 2) 토스 결제창 띄우기
      const TossPayments = await loadTossSdk();
      const payment = TossPayments(clientKey).payment({ customerKey: TossPayments.ANONYMOUS });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: res.amount },
        orderId: res.orderNo,
        orderName: res.orderName,
        customerName: res.buyerName,
        successUrl: `${window.location.origin}/order/confirm`,
        failUrl: `${window.location.origin}/order/fail`,
      });
    } catch (e) {
      const code = (e as { code?: string })?.code;
      if (code === "USER_CANCEL" || code === "PAY_PROCESS_CANCELED") {
        setError("결제를 취소했습니다.");
      } else {
        console.error(e);
        setError((e as { message?: string })?.message || "결제창을 열지 못했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-1">
        <span className="font-label-md text-label-md text-on-surface-variant">주문하시는 분</span>
        <input
          className="h-12 px-3 rounded-lg border border-hanji bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          maxLength={30}
          placeholder="이름"
          autoComplete="name"
          disabled={soldOut || busy}
        />
      </label>
      {error && (
        <p className="font-body-sm text-body-sm text-error" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={buy}
        disabled={soldOut || busy}
        className="h-14 rounded-lg bg-primary-container text-surface font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-sm active:opacity-90 disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[20px]">credit_card</span>
        {soldOut ? "품절" : busy ? "결제창을 여는 중…" : "구매하기"}
      </button>
    </div>
  );
}
