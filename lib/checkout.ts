// 결제 성공 주소로 돌아왔을 때의 서버 처리.
// 1) 주문을 찾고  2) 금액이 주문과 같은지 확인하고  3) 토스 결제 승인 API를 부른 뒤  4) 결제완료로 바꿉니다.
import { getOrderByNo, moveOrderStatus, type PaymentOrder } from "./orders";
import { confirmTossPayment } from "./toss";
import { decreaseStock } from "./products";

export type CheckoutOutcome = { ok: true; order: PaymentOrder; justPaid?: boolean } | { ok: false; message: string; order?: PaymentOrder };

export async function completeCheckout(params: {
  paymentKey: string;
  orderId: string;
  amount: string;
}): Promise<CheckoutOutcome> {
  const { paymentKey, orderId } = params;
  if (!paymentKey || !orderId || !params.amount) return { ok: false, message: "결제 정보가 올바르지 않습니다." };

  const order = await getOrderByNo(orderId);
  if (!order) return { ok: false, message: "주문을 찾을 수 없습니다." };

  // 새로고침 등으로 다시 들어온 경우: 이미 끝난 주문은 그대로 보여줍니다.
  if (order.status === "paid") return { ok: true, order };
  if (order.status !== "pending") {
    return { ok: false, order, message: order.status === "confirming" ? "결제를 승인하는 중입니다. 잠시 후 새로고침해 주세요." : "이미 처리된 주문입니다." };
  }

  // 금액 확인: 결제창에서 넘어온 금액이 서버에 저장한 주문 금액과 다르면 승인하지 않습니다.
  if (!/^\d+$/.test(params.amount) || Number(params.amount) !== order.amount) {
    await moveOrderStatus(orderId, "pending", "failed");
    return { ok: false, order: { ...order, status: "failed" }, message: "결제 금액이 주문 금액과 달라 결제를 진행하지 않았습니다." };
  }

  // 동시에 두 번 승인하지 않도록 먼저 '승인 중'으로 잠급니다.
  if (!(await moveOrderStatus(orderId, "pending", "confirming"))) {
    const latest = await getOrderByNo(orderId);
    if (latest?.status === "paid") return { ok: true, order: latest };
    return { ok: false, order: latest ?? order, message: "이미 처리 중인 주문입니다. 잠시 후 새로고침해 주세요." };
  }

  let result;
  try {
    result = await confirmTossPayment(paymentKey, orderId, order.amount);
  } catch (e) {
    // 네트워크 오류 등: 다시 시도할 수 있도록 결제대기로 되돌립니다.
    console.error("토스 결제 승인 요청 실패:", e);
    await moveOrderStatus(orderId, "confirming", "pending");
    return { ok: false, order, message: "결제 승인 중 연결 오류가 났습니다. 새로고침해 주세요." };
  }

  if (result.ok && result.status === "DONE" && result.orderId === orderId && result.totalAmount === order.amount) {
    await moveOrderStatus(orderId, "confirming", "paid", paymentKey);
    // 결제완료로 바뀐 이 순간에 한 번만 재고를 1개 줄입니다.
    await decreaseStock(order.productId).catch((e) => console.error("재고 차감 실패:", order.orderNo, e));
    return { ok: true, order: { ...order, status: "paid", paymentKey }, justPaid: true };
  }

  await moveOrderStatus(orderId, "confirming", "failed", paymentKey);
  return {
    ok: false,
    order: { ...order, status: "failed" },
    message: result.ok ? `결제가 완료되지 않았습니다. (상태: ${result.status})` : result.message,
  };
}
