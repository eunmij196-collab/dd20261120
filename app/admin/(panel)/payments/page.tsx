import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listProducts } from "@/lib/products";
import { formatDateTime, won } from "@/lib/format";
import { listOrders, ORDER_STATUS_LABEL, type PaymentOrderStatus } from "@/lib/orders";
import { tossConfigured } from "@/lib/toss";
import { ErrorNotice, PageTitle } from "../../_components/ui";

export const metadata: Metadata = { title: "결제 주문" };

// 토스페이먼츠로 결제한 주문 (Turso orders 테이블)
const STATUSES: PaymentOrderStatus[] = ["paid", "pending", "confirming", "failed", "cancelled"];

const badgeClass: Record<PaymentOrderStatus, string> = {
  paid: "bg-primary-container text-on-primary",
  pending: "bg-surface-container-high text-on-surface-variant",
  confirming: "bg-secondary-container text-on-secondary-fixed",
  failed: "bg-error-container text-on-error-container",
  cancelled: "bg-surface-container text-outline",
};

export default async function PaymentsPage({ searchParams }: PageProps<"/admin/payments">) {
  await requireAdmin();
  const sp = await searchParams;
  const statusParam = typeof sp.status === "string" ? sp.status : "all";
  const status = (STATUSES as string[]).includes(statusParam) ? (statusParam as PaymentOrderStatus) : "all";

  let orders: Awaited<ReturnType<typeof listOrders>> = [];
  let loadError = "";
  try {
    orders = await listOrders();
  } catch (e) {
    console.error(e);
    loadError = "결제 주문을 불러오지 못했습니다. 데이터베이스(Turso) 연결을 확인하세요.";
  }
  const productName = new Map((await listProducts().catch(() => [])).map((p) => [p.id, p.name]));

  const filtered = status === "all" ? orders : orders.filter((o) => o.status === status);
  const paid = orders.filter((o) => o.status === "paid");
  const paidTotal = paid.reduce((sum, o) => sum + o.amount, 0);
  const count = (s: PaymentOrderStatus | "all") => (s === "all" ? orders.length : orders.filter((o) => o.status === s).length);

  return (
    <>
      <PageTitle title="결제 주문" desc={`결제완료 ${paid.length}건 · 합계 ${won(paidTotal)}`} />
      {!tossConfigured() && (
        <p className="mb-space-md px-3 py-2 rounded-lg border border-secondary-fixed-dim bg-secondary-fixed/40 text-on-secondary-fixed-variant font-body-sm text-body-sm">
          토스페이먼츠 키(TOSS_CLIENT_KEY, TOSS_SECRET_KEY)가 아직 설정되지 않아 손님이 결제할 수 없습니다.
        </p>
      )}
      {loadError && <ErrorNotice>{loadError}</ErrorNotice>}

      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-space-md">
        {(["all", ...STATUSES] as const).map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin/payments" : `/admin/payments?status=${s}`}
            className={
              "h-9 px-3 rounded-full inline-flex items-center gap-1 whitespace-nowrap font-label-sm text-label-sm " +
              (status === s ? "bg-primary-container text-on-primary" : "bg-surface-container-lowest text-on-surface-variant")
            }
          >
            {s === "all" ? "전체" : ORDER_STATUS_LABEL[s]}
            <span className="tabular-nums opacity-70">{count(s)}</span>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-on-surface-variant py-10 text-center">
          {orders.length === 0 ? "아직 결제 주문이 없습니다." : "해당하는 주문이 없습니다."}
        </p>
      ) : (
        <div className="bg-surface-container-lowest border border-hanji rounded-lg overflow-hidden">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead className="hidden md:table-header-group bg-surface-container-low text-on-surface-variant">
              <tr>
                <th className="px-4 py-2.5 font-semibold">주문번호 · 일시</th>
                <th className="px-4 py-2.5 font-semibold">주문자</th>
                <th className="px-4 py-2.5 font-semibold">상품</th>
                <th className="px-4 py-2.5 font-semibold text-right">금액</th>
                <th className="px-4 py-2.5 font-semibold">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {filtered.map((o) => (
                <tr key={o.id} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 p-3 md:table-row md:p-0">
                  <td className="md:px-4 md:py-3">
                    <span className="font-label-md text-label-md text-on-surface break-all">{o.orderNo}</span>
                    <span className="block text-outline text-[12px]">{formatDateTime(o.createdAt)}</span>
                  </td>
                  <td className="col-span-2 md:px-4 md:py-3 text-on-surface-variant">{o.buyerName}</td>
                  <td className="col-span-2 md:px-4 md:py-3 max-w-xs truncate">{productName.get(o.productId) ?? o.productId}</td>
                  <td className="md:px-4 md:py-3 md:text-right font-semibold tabular-nums">{won(o.amount)}</td>
                  <td className="row-start-1 col-start-2 md:px-4 md:py-3">
                    <span className={"inline-flex px-2 py-0.5 rounded font-label-sm text-[12px] font-semibold whitespace-nowrap " + badgeClass[o.status]}>
                      {ORDER_STATUS_LABEL[o.status] ?? o.status}
                    </span>
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
