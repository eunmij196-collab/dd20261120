// 토스페이먼츠 결제 승인 (서버 전용).
// 시크릿 키(TOSS_SECRET_KEY)는 이 파일에서만 읽고, 브라우저로 절대 보내지 않습니다.
// 이름에 NEXT_PUBLIC_ 이 없는 환경변수는 브라우저 코드에 포함되지 않습니다.

export function tossConfigured() {
  return Boolean(process.env.TOSS_CLIENT_KEY && process.env.TOSS_SECRET_KEY);
}

/** 결제창을 여는 데 쓰는 클라이언트 키 (공개돼도 되는 키) */
export function tossClientKey() {
  return process.env.TOSS_CLIENT_KEY ?? "";
}

export type ConfirmResult =
  | { ok: true; status: string; orderId: string; totalAmount: number; method: string }
  | { ok: false; code: string; message: string };

/** 결제 승인 API: https://docs.tosspayments.com/reference#결제-승인 */
export async function confirmTossPayment(paymentKey: string, orderId: string, amount: number): Promise<ConfirmResult> {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) return { ok: false, code: "NO_SECRET_KEY", message: "결제 설정(TOSS_SECRET_KEY)이 없습니다." };

  const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
      "Content-Type": "application/json",
      // 같은 주문을 여러 번 승인 요청해도 한 번만 처리되도록
      "Idempotency-Key": `confirm-${orderId}`,
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    return {
      ok: false,
      code: String(json.code ?? `HTTP_${res.status}`),
      message: String(json.message ?? "결제 승인에 실패했습니다."),
    };
  }
  return {
    ok: true,
    status: String(json.status ?? ""),
    orderId: String(json.orderId ?? ""),
    totalAmount: Number(json.totalAmount ?? -1),
    method: String(json.method ?? ""),
  };
}
