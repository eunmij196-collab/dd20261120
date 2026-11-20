"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, endSession, requireAdmin, startSession } from "@/lib/auth";
import { updateDb } from "@/lib/db";
import { ORDER_STATUSES, TARGETS } from "@/lib/format";
import type { OrderStatus, Product, Target } from "@/lib/types";

export type FormState = { error?: string } | undefined;

function refresh() {
  revalidatePath("/admin", "layout");
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

// ── 로그인 ────────────────────────────────────────────

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return { error: "서버에 ADMIN_PASSWORD / ADMIN_SESSION_SECRET 환경변수가 설정되지 않았습니다." };
  }
  if (!checkPassword(str(fd, "password"))) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ── 상품 ──────────────────────────────────────────────

export async function saveProduct(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();

  const id = str(fd, "id");
  const name = str(fd, "name");
  const price = Number(str(fd, "price"));
  const originalRaw = str(fd, "originalPrice");
  const originalPrice = originalRaw ? Number(originalRaw) : null;
  const stock = Number(str(fd, "stock"));

  if (!name) return { error: "상품명을 입력하세요." };
  if (!Number.isInteger(price) || price <= 0) return { error: "판매가는 0보다 큰 숫자로 입력하세요." };
  if (originalPrice !== null && (!Number.isInteger(originalPrice) || originalPrice < price)) {
    return { error: "정가는 판매가보다 크거나 같은 숫자로 입력하세요. 할인이 없으면 비워 두세요." };
  }
  if (!Number.isInteger(stock) || stock < 0) return { error: "재고는 0 이상의 숫자로 입력하세요." };

  const fields = {
    name,
    region: str(fd, "region"),
    tagline: str(fd, "tagline"),
    description: str(fd, "description"),
    imageUrl: str(fd, "imageUrl"),
    price,
    originalPrice,
    stock,
    badges: str(fd, "badges").split(",").map((b) => b.trim()).filter(Boolean),
    targets: fd.getAll("targets").map(String).filter((t): t is Target => TARGETS.includes(t as Target)),
    status: (str(fd, "status") === "hidden" ? "hidden" : "active") as Product["status"],
    coldChain: fd.get("coldChain") === "on",
  };

  const notFound = await updateDb((db) => {
    const now = new Date().toISOString();
    if (id) {
      const p = db.products.find((x) => x.id === id);
      if (!p) return true;
      Object.assign(p, fields, { updatedAt: now });
    } else {
      db.products.unshift({ id: `p-${Date.now().toString(36)}`, ...fields, createdAt: now, updatedAt: now });
    }
    return false;
  });
  if (notFound) return { error: "상품을 찾을 수 없습니다. 이미 삭제되었을 수 있습니다." };

  refresh();
  redirect("/admin/products");
}

export async function toggleProductStatus(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDb((db) => {
    const p = db.products.find((x) => x.id === id);
    if (p) {
      p.status = p.status === "active" ? "hidden" : "active";
      p.updatedAt = new Date().toISOString();
    }
  });
  refresh();
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDb((db) => {
    db.products = db.products.filter((x) => x.id !== id);
  });
  refresh();
  redirect("/admin/products");
}

// ── 주문·배송 ─────────────────────────────────────────

function parseStatus(v: string): OrderStatus | null {
  return ORDER_STATUSES.includes(v as OrderStatus) ? (v as OrderStatus) : null;
}

export async function setOrderStatus(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const status = parseStatus(str(fd, "status"));
  if (!status) return;
  await updateDb((db) => {
    const o = db.orders.find((x) => x.id === id);
    if (o) o.status = status;
  });
  refresh();
}

export async function updateOrder(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const status = parseStatus(str(fd, "status"));
  const trackingNumber = str(fd, "trackingNumber");
  if (!status) return { error: "주문 상태를 선택하세요." };
  if ((status === "shipping" || status === "delivered") && !trackingNumber) {
    return { error: "배송중·배송완료로 바꾸려면 송장번호를 입력하세요." };
  }
  const found = await updateDb((db) => {
    const o = db.orders.find((x) => x.id === id);
    if (!o) return false;
    o.status = status;
    o.trackingNumber = trackingNumber;
    o.memo = str(fd, "memo");
    return true;
  });
  if (!found) return { error: "주문을 찾을 수 없습니다." };
  refresh();
  return {};
}

/** 송장번호를 넣고 배송중으로 바꿉니다 (배송 관리 화면). */
export async function shipOrder(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const trackingNumber = str(fd, "trackingNumber");
  if (!trackingNumber) return { error: "송장번호를 입력하세요." };
  await updateDb((db) => {
    const o = db.orders.find((x) => x.id === id);
    if (o && o.status !== "cancelled") {
      o.trackingNumber = trackingNumber;
      o.status = "shipping";
    }
  });
  refresh();
  return {};
}
