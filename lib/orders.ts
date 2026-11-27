// 결제 주문 저장소 (Turso 데이터베이스의 orders 테이블). 서버에서만 사용합니다.
// 상태 흐름: pending(결제대기) → confirming(승인 중) → paid(결제완료)
//           결제 실패·금액 불일치는 failed, 결제창에서 취소하면 cancelled
import { randomBytes, randomUUID } from "crypto";
import { execute } from "./turso";

export type PaymentOrderStatus = "pending" | "confirming" | "paid" | "failed" | "cancelled";

export type PaymentOrder = {
  id: string;
  orderNo: string;
  productId: string;
  amount: number;
  buyerName: string;
  status: PaymentOrderStatus;
  paymentKey: string;
  createdAt: string;
};

export const ORDER_STATUS_LABEL: Record<PaymentOrderStatus, string> = {
  pending: "결제대기",
  confirming: "승인 중",
  paid: "결제완료",
  failed: "결제실패",
  cancelled: "결제취소",
};

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_no TEXT NOT NULL UNIQUE,
    product_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    buyer_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_key TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  )`,
  "CREATE INDEX IF NOT EXISTS orders_created ON orders (created_at DESC)",
];

let ready: Promise<unknown> | null = null;
export function ensureOrdersTable() {
  ready ??= execute(SCHEMA.map((sql) => ({ sql }))).catch((e) => {
    ready = null;
    throw e;
  });
  return ready;
}

function toOrder(r: Record<string, string | null>): PaymentOrder {
  return {
    id: r.id ?? "",
    orderNo: r.order_no ?? "",
    productId: r.product_id ?? "",
    amount: Number(r.amount ?? 0),
    buyerName: r.buyer_name ?? "",
    status: (r.status ?? "pending") as PaymentOrderStatus,
    paymentKey: r.payment_key ?? "",
    createdAt: r.created_at ?? "",
  };
}

/** 토스 orderId 규칙(영문·숫자·-·_, 6~64자)에 맞는 주문번호. 예: ORD-20261127-K3J9X2M8QA */
function newOrderNo() {
  const d = new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10).replace(/-/g, "");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from(randomBytes(10), (b) => chars[b % chars.length]).join("");
  return `ORD-${d}-${rand}`;
}

export async function createPendingOrder(input: { productId: string; amount: number; buyerName: string }) {
  await ensureOrdersTable();
  const order: PaymentOrder = {
    id: randomUUID(),
    orderNo: newOrderNo(),
    productId: input.productId,
    amount: input.amount,
    buyerName: input.buyerName,
    status: "pending",
    paymentKey: "",
    createdAt: new Date().toISOString(),
  };
  await execute([
    {
      sql: `INSERT INTO orders (id, order_no, product_id, amount, buyer_name, status, payment_key, created_at)
            VALUES (?, ?, ?, ?, ?, 'pending', '', ?)`,
      args: [order.id, order.orderNo, order.productId, order.amount, order.buyerName, order.createdAt],
    },
  ]);
  return order;
}

export async function getOrderByNo(orderNo: string) {
  await ensureOrdersTable();
  const [rows] = await execute([{ sql: "SELECT * FROM orders WHERE order_no = ?", args: [orderNo] }]);
  return rows[0] ? toOrder(rows[0]) : null;
}

/**
 * from 상태일 때만 to 상태로 바꿉니다. 바뀌었으면 true.
 * (같은 주문을 두 번 승인하지 않도록, 상태 확인과 변경을 한 번에 처리합니다.)
 */
export async function moveOrderStatus(
  orderNo: string,
  from: PaymentOrderStatus,
  to: PaymentOrderStatus,
  paymentKey?: string,
) {
  await ensureOrdersTable();
  const [rows] = await execute([
    {
      sql:
        paymentKey === undefined
          ? "UPDATE orders SET status = ? WHERE order_no = ? AND status = ? RETURNING id"
          : "UPDATE orders SET status = ?, payment_key = ? WHERE order_no = ? AND status = ? RETURNING id",
      args: paymentKey === undefined ? [to, orderNo, from] : [to, paymentKey, orderNo, from],
    },
  ]);
  return rows.length > 0;
}

/** 최근 주문 목록 (관리자 화면용) */
export async function listOrders(limit = 300) {
  await ensureOrdersTable();
  const [rows] = await execute([{ sql: "SELECT * FROM orders ORDER BY created_at DESC LIMIT ?", args: [limit] }]);
  return rows.map(toOrder);
}
