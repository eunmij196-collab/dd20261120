import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { formatDay, todayKst } from "@/lib/format";
import type { Order } from "@/lib/types";
import { setOrderStatus } from "../../actions";
import { PageTitle, SampleNotice, StatusBadge } from "../../_components/ui";
import ShipForm from "./ShipForm";

export const metadata: Metadata = { title: "배송 관리" };

export default async function ShippingPage() {
  await requireAdmin();
  const { orders, products } = await readDb();
  const today = todayKst();
  const isCold = (o: Order) => o.items.some((i) => products.find((p) => p.id === i.productId)?.coldChain);

  // 아직 보내지 않은 주문(결제완료·상품준비)을 희망 배송일별로 묶습니다.
  const pending = orders
    .filter((o) => o.status === "paid" || o.status === "preparing")
    .sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate));
  const groups = new Map<string, Order[]>();
  for (const o of pending) groups.set(o.deliveryDate, [...(groups.get(o.deliveryDate) ?? []), o]);

  const inTransit = orders.filter((o) => o.status === "shipping");

  return (
    <>
      <PageTitle title="배송 관리" desc={`보낼 주문 ${pending.length}건 · 배송중 ${inTransit.length}건`} />
      {orders.some((o) => o.isSample) && <SampleNotice />}

      {groups.size === 0 && <p className="text-on-surface-variant py-10 text-center">보낼 주문이 없습니다.</p>}

      <div className="flex flex-col gap-5">
        {[...groups].map(([date, list]) => {
          const late = date < today;
          const urgent = date <= todayKst(1);
          return (
            <section key={date}>
              <h2 className="flex items-center gap-2 mb-2 font-headline-md text-headline-md">
                {formatDay(date)}
                <span className="font-label-sm text-label-sm text-on-surface-variant">{list.length}건</span>
                {late && <span className="px-2 py-0.5 rounded-full bg-error text-on-error text-[12px] font-semibold">지연</span>}
                {!late && urgent && (
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[12px] font-semibold">긴급</span>
                )}
              </h2>
              <ul className="flex flex-col gap-2">
                {list.map((o) => (
                  <li key={o.id} className="bg-surface-container-lowest border border-hanji rounded-lg p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/admin/orders/${o.id}`} className="font-label-md text-label-md hover:underline">
                          {o.id}
                        </Link>
                        <StatusBadge status={o.status} />
                        {isCold(o) && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 rounded bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-semibold">
                            <span className="material-symbols-outlined text-[14px]">ac_unit</span>냉장
                          </span>
                        )}
                        {o.wrapping === "bojagi" && (
                          <span className="px-1.5 rounded bg-secondary-container text-on-secondary-container text-[11px] font-semibold">보자기</span>
                        )}
                      </div>
                      <p className="font-body-sm text-body-sm mt-1 truncate">
                        {o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        {o.recipient.name} · {o.recipient.phone} · {o.recipient.address}
                      </p>
                      {o.giftMessage && (
                        <p className="font-body-sm text-[12px] text-secondary mt-0.5 truncate">메시지 카드: “{o.giftMessage}”</p>
                      )}
                    </div>
                    <div className="flex flex-col md:items-end gap-1.5 shrink-0">
                      {o.status === "paid" && (
                        <form action={setOrderStatus}>
                          <input type="hidden" name="id" value={o.id} />
                          <input type="hidden" name="status" value="preparing" />
                          <button className="h-9 px-3 rounded-lg bg-surface-container font-label-sm text-label-sm">상품준비로 변경</button>
                        </form>
                      )}
                      <ShipForm orderId={o.id} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {inTransit.length > 0 && (
        <section className="mt-space-xl">
          <h2 className="font-headline-md text-headline-md mb-2">배송중</h2>
          <ul className="bg-surface-container-lowest border border-hanji rounded-lg divide-y divide-outline-variant/50">
            {inTransit.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 p-3">
                <Link href={`/admin/orders/${o.id}`} className="font-label-md text-label-md hover:underline">
                  {o.id}
                </Link>
                <span className="font-body-sm text-body-sm text-on-surface-variant flex-1 min-w-0 truncate">
                  {o.recipient.name} · 송장 {o.trackingNumber}
                </span>
                <form action={setOrderStatus}>
                  <input type="hidden" name="id" value={o.id} />
                  <input type="hidden" name="status" value="delivered" />
                  <button className="h-9 px-3 rounded-lg bg-surface-container font-label-sm text-label-sm">배송완료 처리</button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
