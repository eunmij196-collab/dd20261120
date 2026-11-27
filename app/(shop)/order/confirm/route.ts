// 토스 결제창에서 결제가 끝나면 이 주소로 돌아옵니다 (successUrl).
// 서버에서 금액 확인 → 결제 승인 → 결제완료·재고 차감을 마친 뒤 결과 화면으로 보냅니다.
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { completeCheckout } from "@/lib/checkout";
import { PRODUCTS_TAG } from "@/lib/shop";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const orderId = sp.get("orderId") ?? "";

  let ok = false;
  let message = "";
  try {
    const outcome = await completeCheckout({
      paymentKey: sp.get("paymentKey") ?? "",
      orderId,
      amount: sp.get("amount") ?? "",
    });
    ok = outcome.ok;
    if (!outcome.ok) message = outcome.message;
    // 재고가 줄었으니 상품 목록 캐시를 바로 새로 고칩니다.
    if (outcome.ok && outcome.justPaid) revalidateTag(PRODUCTS_TAG, { expire: 0 });
  } catch (e) {
    console.error("결제 확인 중 오류:", e);
    message = "결제를 확인하는 중 오류가 났습니다. 잠시 후 새로고침해 주세요.";
  }

  const to = new URL("/order/success", req.nextUrl.origin);
  if (orderId) to.searchParams.set("orderId", orderId);
  if (!ok) to.searchParams.set("error", message.slice(0, 200));
  return NextResponse.redirect(to, 303);
}
