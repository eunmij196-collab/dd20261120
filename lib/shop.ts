// 쇼핑몰(메인 화면)에서 쓰는 상품 목록.
// 관리자 화면에서 상품을 저장하면 "products" 태그가 갱신되어 메인 화면에 바로 반영됩니다.
import { cacheLife, cacheTag } from "next/cache";
import { readDb } from "./db";
import { createSeed } from "./seed";
import type { Product } from "./types";

export const PRODUCTS_TAG = "products";

export async function getShopProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(PRODUCTS_TAG);
  cacheLife("hours");

  let products: Product[];
  try {
    products = (await readDb()).products;
  } catch (e) {
    // 저장소(Redis)가 아직 연결되지 않았을 때도 화면이 깨지지 않도록 기본 상품을 보여줍니다.
    console.error("상품을 불러오지 못해 기본 상품을 표시합니다:", e);
    products = createSeed().products;
  }
  return products.filter((p) => p.status === "active");
}
