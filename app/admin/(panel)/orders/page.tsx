import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { ORDER_STATUSES, formatDateTime, formatDay, statusLabel, won } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";
import { PageTitle, SampleNotice, StatusBadge, inputClass } from "../../_components/ui";

export const metadata: Metadata = { title: "주문 관리" };

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  await requireAdmin();
  const sp = await searchParams;
  const statusParam = typeof sp.status === "string" ? sp.status : "all";
  const status = (ORDER_STATUSES as string[]).includes(statusParam) ? (statusParam as OrderStatus) : "all";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const { orders } = await readDb();
  const sorted = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const filtered = sorted.filter(
    (o) =>
      (status === "all" || o.status === status) &&
      (!q ||
        [o.id, o.customer.name, o.customer.phone, o.recipient.name, o.recipient.phone].some((v) => v.includes(q))),
  );

  const count = (s: OrderStatus | "all") => (s === "all" ? orders.length : orders.filter((o) => o.status === s).length);
  const tabHref = (s: string) => {
    const p = new URLSearchParams();
    if (s !== "all") p.set("status", s);
    if (q) p.set("q", q);
    const qs = p.toString();
    return `/admin/orders${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <PageTitle title="주문 관리" desc={`전체 ${orders.length}건`} />
      {orders.some((o) => o.isSample) && <SampleNotice />}

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-space-md">
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(["all", ...ORDER_STATUSES] as const).map((s) => (
            <Link
              key={s}
              href={tabHref(s)}
              className={
                "h-9 px-3 rounded-full inline-flex items-center gap-1 whitespace-nowrap font-label-sm text-label-sm " +
                (status === s ? "bg-primary-container text-on-primary" : "bg-surface-container-lowest text-on-surface-variant")
              }
            >
              {s === "all" ? "전체" : statusLabel[s]}
              <span className="tabular-nums opacity-70">{count(s)}</span>
            </Link>
          ))}
        </div>
        <form className="md:ml-auto flex gap-1.5">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="주문번호·이름·전화번호" className={inputClass + " w-full md:w-56"} />
          <button className="h-10 px-3 rounded-lg bg-surface-container-lowest" aria-label="검색">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
        </form>
      </div>

      {filtered.length === 0 ? (
        <p className="text-on-surface-variant py-10 text-center">해당하는 주문이 없습니다.</p>
      ) : (
        <div className="bg-surface-container-lowest border border-hanji rounded-lg overflow-hidden">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead className="hidden md:table-header-group bg-surface-container-low text-on-surface-variant">
              <tr>
                <th className="px-4 py-2.5 font-semibold">주문번호 · 일시</th>
                <th className="px-4 py-2.5 font-semibold">주문자 → 받는 분</th>
                <th className="px-4 py-2.5 font-semibold">상품</th>
                <th className="px-4 py-2.5 font-semibold text-right">금액</th>
                <th className="px-4 py-2.5 font-semibold">희망 배송일</th>
                <th className="px-4 py-2.5 font-semibold">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {filtered.map((o) => (
                <tr key={o.id} className="relative grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 p-3 md:table-row md:p-0 hover:bg-surface-container-low">
                  <td className="md:px-4 md:py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-label-md text-label-md text-on-surface after:absolute after:inset-0">
                      {o.id}
                    </Link>
                    <span className="block text-outline text-[12px]">{formatDateTime(o.createdAt)}</span>
                  </td>
                  <td className="order-last col-span-2 md:order-none md:px-4 md:py-3 text-on-surface-variant">
                    {o.customer.name} → {o.recipient.name}
                  </td>
                  <td className="col-span-2 md:px-4 md:py-3 max-w-xs truncate">
                    {o.items[0]?.name}
                    {o.items.length > 1 && <span className="text-outline"> 외 {o.items.length - 1}건</span>}
                    {o.wrapping === "bojagi" && <span className="ml-1 text-secondary text-[12px]">· 보자기</span>}
                  </td>
                  <td className="md:px-4 md:py-3 md:text-right font-semibold tabular-nums">{won(o.total)}</td>
                  <td className="md:px-4 md:py-3 text-on-surface-variant whitespace-nowrap">{formatDay(o.deliveryDate)}</td>
                  <td className="row-start-1 col-start-2 md:px-4 md:py-3">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
