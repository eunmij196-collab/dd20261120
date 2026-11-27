"use client";

import { useEffect, useRef, useState } from "react";
import { startCheckout, type StartCheckoutResult } from "../actions";

// 토스페이먼츠 SDK (v2) — 필요할 때만 불러옵니다.
//  - 결제위젯 키(…_gck_…): 이 화면 안에 결제수단·약관 위젯을 그린 뒤 결제
//  - API 개별 연동 키(…_ck_…): 토스 결제창을 바로 띄워 결제
type Widgets = {
  setAmount: (a: { currency: string; value: number }) => Promise<void>;
  renderPaymentMethods: (o: { selector: string; variantKey?: string }) => Promise<unknown>;
  renderAgreement: (o: { selector: string; variantKey?: string }) => Promise<unknown>;
  requestPayment: (o: Record<string, unknown>) => Promise<void>;
};
type TossPaymentsFn = ((clientKey: string) => {
  payment: (o: { customerKey: string }) => { requestPayment: (o: Record<string, unknown>) => Promise<void> };
  widgets: (o: { customerKey: string }) => Widgets;
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

type Order = Extract<StartCheckoutResult, { ok: true }>;

function paymentRequest(o: Order) {
  return {
    orderId: o.orderNo,
    orderName: o.orderName,
    customerName: o.buyerName,
    successUrl: `${window.location.origin}/order/confirm`,
    failUrl: `${window.location.origin}/order/fail`,
  };
}

function errorText(e: unknown) {
  const code = (e as { code?: string })?.code;
  if (code === "USER_CANCEL" || code === "PAY_PROCESS_CANCELED") return "결제를 취소했습니다.";
  console.error(e);
  return (e as { message?: string })?.message || "결제를 진행하지 못했습니다. 잠시 후 다시 시도해 주세요.";
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
  const [widgetOrder, setWidgetOrder] = useState<Order | null>(null);
  const useWidget = /_gck_/.test(clientKey);

  async function buy() {
    setError("");
    if (!buyerName.trim()) return setError("주문하시는 분 이름을 입력하세요.");
    if (!clientKey) return setError("결제 설정이 아직 완료되지 않았습니다.");
    setBusy(true);
    try {
      // 1) 서버가 상품 가격으로 주문을 저장
      const res = await startCheckout(productId, buyerName);
      if (!res.ok) return setError(res.error);

      // 2) 결제위젯 키면 결제수단 선택 창을, 아니면 토스 결제창을 띄웁니다.
      if (useWidget) return setWidgetOrder(res);
      const TossPayments = await loadTossSdk();
      await TossPayments(clientKey)
        .payment({ customerKey: TossPayments.ANONYMOUS })
        .requestPayment({ method: "CARD", amount: { currency: "KRW", value: res.amount }, ...paymentRequest(res) });
    } catch (e) {
      setError(errorText(e));
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
        {soldOut ? "품절" : busy ? "주문을 준비하는 중…" : "구매하기"}
      </button>

      {widgetOrder && (
        <WidgetSheet
          clientKey={clientKey}
          order={widgetOrder}
          onClose={(msg) => {
            setWidgetOrder(null);
            if (msg) setError(msg);
          }}
        />
      )}
    </div>
  );
}

/** 결제위젯: 결제수단·약관을 화면 아래에서 올라오는 창에 그리고, 결제하기 버튼으로 결제합니다. */
function WidgetSheet({
  clientKey,
  order,
  onClose,
}: {
  clientKey: string;
  order: Order;
  onClose: (message?: string) => void;
}) {
  const widgetsRef = useRef<Widgets | null>(null);
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const TossPayments = await loadTossSdk();
        const widgets = TossPayments(clientKey).widgets({ customerKey: TossPayments.ANONYMOUS });
        await widgets.setAmount({ currency: "KRW", value: order.amount });
        await Promise.all([
          widgets.renderPaymentMethods({ selector: "#toss-payment-method", variantKey: "DEFAULT" }),
          widgets.renderAgreement({ selector: "#toss-agreement", variantKey: "AGREEMENT" }),
        ]);
        if (cancelled) return;
        widgetsRef.current = widgets;
        setReady(true);
      } catch (e) {
        if (!cancelled) setError(errorText(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clientKey, order.amount]);

  async function pay() {
    if (!widgetsRef.current) return;
    setError("");
    setPaying(true);
    try {
      await widgetsRef.current.requestPayment(paymentRequest(order));
    } catch (e) {
      setError(errorText(e));
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-label="결제">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">{order.orderName}</p>
            <p className="font-headline-md text-headline-md text-on-surface font-bold">{order.amount.toLocaleString("ko-KR")}원</p>
          </div>
          <button type="button" className="p-2 text-on-surface-variant" onClick={() => onClose()} aria-label="닫기">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {!ready && !error && <p className="py-8 text-center text-on-surface-variant">결제수단을 불러오는 중…</p>}
        <div id="toss-payment-method" />
        <div id="toss-agreement" />
        {error && (
          <p className="font-body-sm text-body-sm text-error" role="alert">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={pay}
          disabled={!ready || paying}
          className="h-14 rounded-lg bg-primary-container text-surface font-label-md text-label-md font-bold disabled:opacity-50"
        >
          {paying ? "결제 진행 중…" : `${order.amount.toLocaleString("ko-KR")}원 결제하기`}
        </button>
      </div>
    </div>
  );
}
