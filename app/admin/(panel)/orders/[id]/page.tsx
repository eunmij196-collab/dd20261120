import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { formatDateTime, formatDay, won } from "@/lib/format";
import { Card, PageTitle, StatusBadge } from "../../../_components/ui";
import OrderEditForm from "./OrderEditForm";

export const metadata: Metadata = { title: "주문 상세" };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-2 py-1.5">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="text-on-surface min-w-0 break-words">{children}</dd>
    </div>
  );
}

export default async function OrderDetailPage({ params }: PageProps<"/admin/orders/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { orders, products } = await readDb();
  const order = orders.find((o) => o.id === id);
  if (!order) notFound();
  const coldChain = order.items.some((i) => products.find((p) => p.id === i.productId)?.coldChain);

  return (
    <>
      <Link href="/admin/orders" className="inline-flex items-center gap-1 mb-2 font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>주문 목록
      </Link>
      <PageTitle title={order.id} desc={`${formatDateTime(order.createdAt)} 주문`}>
        <StatusBadge status={order.status} />
      </PageTitle>

      <div className="grid lg:grid-cols-[1fr_20rem] gap-4 items-start">
        <div className="flex flex-col gap-4">
          <Card>
            <h2 className="font-headline-md text-headline-md mb-3">주문 상품</h2>
            <ul className="divide-y divide-outline-variant/50 font-body-sm text-body-sm">
              {order.items.map((i) => (
                <li key={i.productId} className="flex items-center gap-3 py-2">
                  <span className="flex-1 min-w-0">{i.name}</span>
                  <span className="text-on-surface-variant tabular-nums whitespace-nowrap">
                    {won(i.price)} × {i.quantity}
                  </span>
                  <span className="w-24 text-right font-semibold tabular-nums">{won(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-3 mt-1 border-t border-outline-variant font-label-lg text-label-lg">
              <span>합계</span>
              <span className="tabular-nums">{won(order.total)}</span>
            </div>
          </Card>

          <Card>
            <h2 className="font-headline-md text-headline-md mb-2">배송 · 포장</h2>
            <dl className="font-body-sm text-body-sm">
              <Row label="희망 배송일">{formatDay(order.deliveryDate)}</Row>
              <Row label="포장">{order.wrapping === "bojagi" ? "보자기 포장 (무료)" : "기본 포장"}</Row>
              <Row label="발송 방법">{coldChain ? "냉장·냉동 특송" : "일반 택배"}</Row>
              <Row label="선물 메시지">{order.giftMessage || <span className="text-outline">없음</span>}</Row>
              <Row label="송장번호">{order.trackingNumber || <span className="text-outline">미입력</span>}</Row>
            </dl>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <h2 className="font-headline-md text-headline-md mb-2">주문자</h2>
              <dl className="font-body-sm text-body-sm">
                <Row label="이름">{order.customer.name}</Row>
                <Row label="연락처">{order.customer.phone}</Row>
                <Row label="이메일">{order.customer.email}</Row>
              </dl>
            </Card>
            <Card>
              <h2 className="font-headline-md text-headline-md mb-2">받는 분</h2>
              <dl className="font-body-sm text-body-sm">
                <Row label="이름">{order.recipient.name}</Row>
                <Row label="연락처">{order.recipient.phone}</Row>
                <Row label="주소">{order.recipient.address}</Row>
              </dl>
            </Card>
          </div>
        </div>

        <Card className="lg:sticky lg:top-8">
          <h2 className="font-headline-md text-headline-md mb-3">주문 처리</h2>
          <OrderEditForm key={`${order.status}-${order.trackingNumber}-${order.memo}`} order={order} />
        </Card>
      </div>
    </>
  );
}
