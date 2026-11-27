/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getShopProducts } from "@/lib/shop";
import { SITE_URL } from "@/lib/site";
import { tossClientKey } from "@/lib/toss";
import { paymentsEnabled } from "@/lib/settings";
import BuyButton from "./BuyButton";

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

async function findProduct(id: string) {
  return (await getShopProducts()).find((p) => p.id === id) ?? null;
}

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = await findProduct(id);
  if (!p) return { title: "상품을 찾을 수 없습니다 | 경남명품향토몰" };
  return {
    metadataBase: new URL(SITE_URL),
    title: `${p.name} | 경남명품향토몰`,
    description: p.description.slice(0, 120) || p.tagline,
    alternates: { canonical: `/products/${p.id}` },
    openGraph: p.imageUrl ? { images: [p.imageUrl] } : undefined,
  };
}

async function ProductView({ params }: { params: PageProps<"/products/[id]">["params"] }) {
  const { id } = await params;
  const p = await findProduct(id);
  if (!p) notFound();
  const canPay = await paymentsEnabled();

  const soldOut = p.stock <= 0;
  const rate = p.originalPrice && p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

  return (
    <article className="flex flex-col gap-space-md">
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container">
        {p.imageUrl ? (
          <img className={"w-full h-full object-cover" + (soldOut ? " opacity-60" : "")} src={p.imageUrl} alt={p.name} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[48px]">image</span>
          </div>
        )}
        {p.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {p.badges.map((b, i) => (
              <span key={b + i} className="px-2 py-0.5 rounded-sm bg-primary text-on-primary font-label-sm text-[11px] font-bold">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
          <span className="px-1.5 py-0.5 rounded bg-surface-container font-medium text-secondary">{p.region}</span>
          {p.tagline && <span>{p.tagline}</span>}
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold leading-snug">{p.name}</h1>
        <div className="flex items-baseline gap-2">
          {rate > 0 && (
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-tertiary-container font-extrabold">{rate}%</span>
          )}
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">{won(p.price)}</span>
          {rate > 0 && p.originalPrice && (
            <span className="font-body-sm text-body-sm text-outline line-through">{won(p.originalPrice)}</span>
          )}
        </div>
        {p.coldChain && (
          <p className="flex items-center gap-1 font-label-sm text-label-sm text-secondary">
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>무료 냉장특송
          </p>
        )}
      </div>

      {p.description && (
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">{p.description}</p>
      )}

      {canPay ? (
        <BuyButton productId={p.id} clientKey={tossClientKey()} soldOut={soldOut} />
      ) : (
        <div className="p-4 rounded-lg bg-surface-container-low flex flex-col gap-1 text-center">
          <p className="font-label-md text-label-md text-on-surface font-bold">지금은 온라인 결제를 잠시 쉬고 있어요</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            주문은 전화로 도와드릴게요 ·{" "}
            <a href="tel:055-123-4567" className="text-secondary font-semibold underline">
              055-123-4567
            </a>
          </p>
        </div>
      )}
    </article>
  );
}

export default function ProductPage({ params }: PageProps<"/products/[id]">) {
  return (
    <div className="px-margin-mobile max-w-xl mx-auto pt-space-md pb-space-lg flex flex-col gap-space-md">
      <Link href="/" className="self-start inline-flex items-center gap-1 font-label-md text-label-md text-secondary hover:underline">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        상품 목록
      </Link>
      <Suspense fallback={<p className="text-on-surface-variant py-16 text-center">불러오는 중…</p>}>
        <ProductView params={params} />
      </Suspense>
    </div>
  );
}
