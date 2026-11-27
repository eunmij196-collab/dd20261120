"use server";

import { getProduct } from "@/lib/products";
import { createPendingOrder } from "@/lib/orders";
import { tossConfigured } from "@/lib/toss";
import { paymentsEnabledFresh } from "@/lib/settings";

export type StartCheckoutResult =
  | { ok: true; orderNo: string; amount: number; orderName: string; buyerName: string }
  | { ok: false; error: string };

// 눈에 안 보이는 제어 문자 제거
const clean = (s: string) => s.replace(/[\u0000-\u001F\u007F]/g, "").trim();

/**
 * 구매하기 버튼을 누르면 실행됩니다.
 * 금액은 브라우저가 보낸 값이 아니라 서버에 저장된 상품 가격으로 정합니다.
 */
export async function startCheckout(productId: string, buyerNameRaw: string): Promise<StartCheckoutResult> {
  if (!tossConfigured()) return { ok: false, error: "결제 설정이 아직 완료되지 않았습니다. 잠시 후 다시 시도해 주세요." };

  if (!(await paymentsEnabledFresh().catch(() => false))) {
    return { ok: false, error: "지금은 온라인 결제를 잠시 쉬고 있습니다. 전화로 주문해 주세요." };
  }

  const buyerName = clean(String(buyerNameRaw ?? ""));
  if (!buyerName) return { ok: false, error: "주문하시는 분 이름을 입력하세요." };
  if (buyerName.length > 30) return { ok: false, error: "이름은 30자 이하로 입력하세요." };

  const product = await getProduct(String(productId));
  if (!product || product.status !== "active") return { ok: false, error: "판매 중인 상품이 아닙니다." };
  if (product.stock <= 0) return { ok: false, error: "품절된 상품입니다." };
  if (!Number.isInteger(product.price) || product.price < 100) return { ok: false, error: "상품 가격을 확인할 수 없습니다." };

  try {
    const order = await createPendingOrder({ productId: product.id, amount: product.price, buyerName });
    return { ok: true, orderNo: order.orderNo, amount: order.amount, orderName: product.name.slice(0, 100), buyerName };
  } catch (e) {
    console.error("주문 저장 실패:", e);
    return { ok: false, error: "주문을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }
}
