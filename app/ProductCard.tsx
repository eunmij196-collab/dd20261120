/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Product } from "@/lib/types";

// 메인 화면 상품 카드 (관리자 화면에서 등록·수정한 상품 정보로 그려짐)

const BADGE_STYLES = [
  "bg-primary text-on-primary font-bold shadow-sm",
  "bg-secondary text-on-secondary font-semibold",
  "bg-secondary-container text-on-secondary-fixed font-bold",
];

function discountRate(price: number, originalPrice: number | null) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

export default function ProductCard({
  product: p,
  featured,
  hidden,
  onCart,
}: {
  product: Product;
  featured: boolean;
  hidden: boolean;
  onCart: (title: string, price: string) => void;
}) {
  const rate = discountRate(p.price, p.originalPrice);
  const soldOut = p.stock <= 0;
  const priceText = p.price.toLocaleString("ko-KR");

  return (
    <article
      className={
        "gift-card bg-surface-container-lowest rounded-xl shadow-sm p-3.5 flex flex-col gap-3 relative overflow-hidden" +
        (hidden ? " hidden" : "")
      }
      data-price={p.price}
      data-target={p.targets.join(" ")}
    >
      {p.badges.length > 0 && (
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
          {p.badges.map((b, i) => (
            <span
              key={b + i}
              className={`px-2 py-0.5 rounded-sm font-label-sm text-[11px] ${BADGE_STYLES[i % BADGE_STYLES.length]}`}
            >
              {b}
            </span>
          ))}
        </div>
      )}
      <Link href={`/products/${p.id}`} className="relative block w-full aspect-[16/10] rounded-lg overflow-hidden bg-surface-container">
        {p.imageUrl ? (
          <img className={"w-full h-full object-cover" + (soldOut ? " opacity-60" : "")} src={p.imageUrl} alt={p.name} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[40px]">image</span>
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-on-surface/80 text-surface font-label-md text-label-md font-bold">
              일시 품절
            </span>
          </div>
        )}
        {p.coldChain && (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-primary/80 backdrop-blur-sm text-surface font-label-sm text-[11px] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
            <span>무료 냉장특송</span>
          </div>
        )}
      </Link>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
          <span className="px-1.5 py-0.5 rounded bg-surface-container font-medium text-secondary">{p.region}</span>
          {p.tagline && <span>{p.tagline}</span>}
        </div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold leading-snug">
          <Link href={`/products/${p.id}`} className="hover:underline">{p.name}</Link>
        </h2>
        {p.description && (
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{p.description}</p>
        )}
        <div className="mt-1 flex items-baseline gap-2">
          {rate > 0 && (
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-tertiary-container font-extrabold">
              {rate}%
            </span>
          )}
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">{won(p.price)}</span>
          {rate > 0 && p.originalPrice && (
            <span className="font-body-sm text-body-sm text-outline line-through">{won(p.originalPrice)}</span>
          )}
        </div>
        {featured && (
          <div className="mt-2 p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between text-on-surface-variant">
            <div className="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span>대량 구매 10+1 혜택 · 견적서 즉시 발급</span>
            </div>
            <span className="text-[11px] text-outline">세금계산서 가능</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            className="h-11 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 active:bg-surface-container-high transition-colors disabled:opacity-50"
            onClick={() => onCart(p.name, priceText)}
            disabled={soldOut}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span>{featured ? "장바구니 담기" : "담기"}</span>
          </button>
          {soldOut ? (
            <button
              className="h-11 rounded-lg bg-primary-container text-surface font-label-md text-label-md flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
              disabled
              type="button"
            >
              품절
            </button>
          ) : (
            <Link
              href={`/products/${p.id}`}
              className="h-11 rounded-lg bg-primary-container text-surface font-label-md text-label-md flex items-center justify-center gap-1 active:opacity-90 shadow-sm transition-all"
            >
              {featured && <span className="material-symbols-outlined text-[18px]">card_giftcard</span>}
              <span>{featured ? "보자기 선물 주문" : "바로 주문하기"}</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
