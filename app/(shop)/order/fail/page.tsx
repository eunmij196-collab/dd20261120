import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { moveOrderStatus } from "@/lib/orders";

export const metadata: Metadata = { title: "결제 실패 | 경남명품향토몰", robots: { index: false } };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

async function Reason({ searchParams }: { searchParams: PageProps<"/order/fail">["searchParams"] }) {
  const sp = await searchParams;
  const code = one(sp.code);
  const orderId = one(sp.orderId);
  const canceled = code === "PAY_PROCESS_CANCELED" || code === "USER_CANCEL";

  // 결제대기 주문을 취소/실패로 표시합니다 (이미 처리된 주문은 바뀌지 않습니다).
  if (orderId) {
    await moveOrderStatus(orderId, "pending", canceled ? "cancelled" : "failed").catch((e) =>
      console.error("주문 상태 변경 실패:", e),
    );
  }

  return (
    <>
      <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
        {canceled ? "결제를 취소했습니다" : "결제에 실패했습니다"}
      </h1>
      {!canceled && one(sp.message) && (
        <p className="font-body-md text-body-md text-on-surface-variant">{one(sp.message).slice(0, 200)}</p>
      )}
      {orderId && <p className="font-body-sm text-body-sm text-outline break-all">주문번호 {orderId}</p>}
    </>
  );
}

export default function OrderFailPage({ searchParams }: PageProps<"/order/fail">) {
  return (
    <div className="px-margin-mobile max-w-md mx-auto pt-space-lg pb-space-lg flex flex-col items-center gap-space-md text-center">
      <span className="material-symbols-outlined text-[56px] text-error" style={{ fontVariationSettings: '"FILL" 1' }}>
        error
      </span>
      <Suspense fallback={null}>
        <Reason searchParams={searchParams} />
      </Suspense>
      <Link
        href="/"
        className="w-full h-12 rounded-lg bg-primary-container text-surface font-label-md text-label-md flex items-center justify-center"
      >
        상품 목록으로
      </Link>
    </div>
  );
}
