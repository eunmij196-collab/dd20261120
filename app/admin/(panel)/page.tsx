import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { formatDay, todayKst, won } from "@/lib/format";
import { Card, PageTitle, SampleNotice, StatusBadge } from "../_components/ui";

const LOW_STOCK = 10;

export default async function DashboardPage() {
  await requireAdmin();
  const { products, orders } = await readDb();

  const today = todayKst();
  const live = orders.filter((o) => o.status !== "cancelled");
  const todayOrders = live.filter(
    (o) => new Date(o.createdAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }) === today,
  );
  const toHandle = orders.filter((o) => o.status === "paid" || o.status === "preparing");
  const lowStock = products.filter((p) => p.status === "active" && p.stock <= LOW_STOCK);
  const upcoming = toHandle
    .filter((o) => o.deliveryDate <= todayKst(3))
    .sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate));

  const stats = [
    { label: "오늘 주문", value: `${todayOrders.length}건`, sub: won(todayOrders.reduce((s, o) => s + o.total, 0)), href: "/admin/orders" },
    { label: "처리할 주문", value: `${toHandle.length}건`, sub: "결제완료 · 상품준비", href: "/admin/shipping" },
    { label: "누적 매출", value: won(live.reduce((s, o) => s + o.total, 0)), sub: `취소 제외 ${live.length}건`, href: "/admin/orders" },
    { label: "재고 부족", value: `${lowStock.length}개`, sub: `재고 ${LOW_STOCK}개 이하`, href: "/admin/products" },
  ];

  return (
    <>
      <PageTitle title="대시보드" desc={`${formatDay(today)} 기준`} />
      {orders.some((o) => o.isSample) && <SampleNotice />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-space-lg">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-surface-container-lowest border border-hanji rounded-lg p-4 hover:border-secondary transition-colors">
            <p className="font-label-sm text-label-sm text-on-surface-variant">{s.label}</p>
            <p className="font-headline-lg text-headline-lg text-primary mt-1 tabular-nums">{s.value}</p>
            <p className="font-body-sm text-body-sm text-outline mt-0.5">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline-md text-headline-md">3일 안에 보내야 할 주문</h2>
            <Link href="/admin/shipping" className="font-label-sm text-label-sm text-secondary">배송 관리 →</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-on-surface-variant font-body-sm text-body-sm py-4">급한 주문이 없습니다.</p>
          ) : (
            <ul className="divide-y divide-outline-variant/50">
              {upcoming.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="flex items-center gap-3 py-2.5 hover:bg-surface-container-low -mx-2 px-2 rounded-lg">
                    <span className={"font-label-md text-label-md w-24 shrink-0 " + (o.deliveryDate <= todayKst(1) ? "text-error" : "text-on-surface")}>
                      {formatDay(o.deliveryDate)}
                    </span>
                    <span className="flex-1 min-w-0 truncate font-body-sm text-body-sm">
                      {o.recipient.name} · {o.items[0]?.name}
                      {o.items.length > 1 && ` 외 ${o.items.length - 1}건`}
                    </span>
                    <StatusBadge status={o.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline-md text-headline-md">재고 부족 상품</h2>
            <Link href="/admin/products" className="font-label-sm text-label-sm text-secondary">제품 관리 →</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-on-surface-variant font-body-sm text-body-sm py-4">재고가 넉넉합니다.</p>
          ) : (
            <ul className="divide-y divide-outline-variant/50">
              {lowStock.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 py-2.5 hover:bg-surface-container-low -mx-2 px-2 rounded-lg">
                    <span className="flex-1 min-w-0 truncate font-body-sm text-body-sm">{p.name}</span>
                    <span className={"font-label-md text-label-md tabular-nums " + (p.stock === 0 ? "text-error" : "text-secondary")}>
                      {p.stock === 0 ? "품절" : `${p.stock}개 남음`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
