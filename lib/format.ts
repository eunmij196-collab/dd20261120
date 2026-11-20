import type { OrderStatus, Target } from "./types";

export function won(n: number) {
  return `${n.toLocaleString("ko-KR")}원`;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDay(ymd: string) {
  const d = new Date(`${ymd}T00:00:00+09:00`);
  return d.toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

/** 한국 시간 기준 오늘 날짜 (YYYY-MM-DD) */
export function todayKst(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000);
  return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

export const ORDER_STATUSES: OrderStatus[] = ["paid", "preparing", "shipping", "delivered", "cancelled"];

export const statusLabel: Record<OrderStatus, string> = {
  paid: "결제완료",
  preparing: "상품준비",
  shipping: "배송중",
  delivered: "배송완료",
  cancelled: "취소·환불",
};

export const statusClass: Record<OrderStatus, string> = {
  paid: "bg-secondary-container text-on-secondary-container",
  preparing: "bg-primary-fixed text-on-primary-fixed-variant",
  shipping: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  delivered: "bg-surface-container-high text-on-surface-variant",
  cancelled: "bg-error-container text-on-error-container",
};

export const TARGETS: Target[] = ["parents", "vip", "bulk", "health"];

export const targetLabel: Record<Target, string> = {
  parents: "부모님·친척",
  vip: "VIP 거래처",
  bulk: "직원복지·단체",
  health: "건강·효도",
};

export function discountRate(price: number, originalPrice: number | null) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}
