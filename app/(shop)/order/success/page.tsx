import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getOrderByNo, ORDER_STATUS_LABEL } from "@/lib/orders";
import { getShopProducts } from "@/lib/shop";

// 결제 결과 화면 (보여주기만 합니다). 실제 승인 처리는 /order/confirm 에서 끝난 상태로 옵니다.
export const metadata: Metadata = { title: "결제 결과 | 경남명품향토몰", robots: { index: false } };

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

async function Result({ searchParams }: { searchParams: PageProps<"/order/success">["searchParams"] }) {
  const sp = await searchParams;
  const orderId = one(sp.orderId);
  const order = orderId ? await getOrderByNo(orderId).catch(() => null) : null;
  const paid = order?.status === "paid";
  const message = paid ? "" : one(sp.error) || (order ? "" : "주문을 찾을 수 없습니다.");
  const productName = order ? (await getShopProducts()).find((p) => p.id === order.productId)?.name : undefined;

  return (
    <div className="flex flex-col items-center gap-space-md text-center">
      <span
        className={"material-symbols-outlined text-[56px] " + (paid ? "text-primary" : "text-error")}
        style={{ fontVariationSettings: '"FILL" 1' }}
      >
        {paid ? "check_circle" : "error"}
      </span>
      <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
        {paid ? "결제가 완료되었습니다" : "결제를 완료하지 못했습니다"}
      </h1>
      {message && <p className="font-body-md text-body-md text-on-surface-variant">{message}</p>}

      {order && (
        <dl className="w-full grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 p-4 rounded-lg bg-surface-container-low text-left font-body-sm text-body-sm">
          <dt className="text-on-surface-variant">주문번호</dt>
          <dd className="text-on-surface font-medium break-all">{order.orderNo}</dd>
          {productName && (
            <>
              <dt className="text-on-surface-variant">상품</dt>
              <dd className="text-on-surface">{productName}</dd>
            </>
          )}
          <dt className="text-on-surface-variant">주문자</dt>
          <dd className="text-on-surface">{order.buyerName}</dd>
          <dt className="text-on-surface-variant">결제금액</dt>
          <dd className="text-on-surface font-bold">{won(order.amount)}</dd>
          <dt className="text-on-surface-variant">상태</dt>
          <dd className="text-on-surface">{ORDER_STATUS_LABEL[order.status]}</dd>
        </dl>
      )}
    </div>
  );
}

export default function OrderSuccessPage({ searchParams }: PageProps<"/order/success">) {
  return (
    <div className="px-margin-mobile max-w-md mx-auto pt-space-lg pb-space-lg flex flex-col gap-space-md">
      <Suspense fallback={<p className="text-on-surface-variant py-16 text-center">결제를 확인하는 중…</p>}>
        <Result searchParams={searchParams} />
      </Suspense>
      <Link
        href="/"
        className="h-12 rounded-lg bg-primary-container text-surface font-label-md text-label-md flex items-center justify-center"
      >
        쇼핑 계속하기
      </Link>
    </div>
  );
}
