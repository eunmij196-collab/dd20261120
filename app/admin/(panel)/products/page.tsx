/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { discountRate, won } from "@/lib/format";
import { toggleProductStatus } from "../../actions";
import { PageTitle, btnPrimary } from "../../_components/ui";

export const metadata: Metadata = { title: "상품 관리" };

export default async function ProductsPage() {
  await requireAdmin();
  const { products } = await readDb();

  return (
    <>
      <PageTitle title="상품 관리" desc={`전체 ${products.length}개 · 판매중 ${products.filter((p) => p.status === "active").length}개`}>
        <Link href="/admin/products/new" className={btnPrimary}>
          <span className="material-symbols-outlined text-[18px]">add</span>
          상품 등록
        </Link>
      </PageTitle>

      {products.length === 0 ? (
        <p className="text-on-surface-variant py-10 text-center">등록된 상품이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {products.map((p) => {
            const rate = discountRate(p.price, p.originalPrice);
            return (
              <li key={p.id} className="bg-surface-container-lowest rounded-2xl shadow-sm p-3 flex items-center gap-3">
                <div className="w-16 h-16 md:w-20 md:h-14 shrink-0 rounded-lg overflow-hidden bg-surface-container">
                  {p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label-sm text-[12px] text-secondary">{p.region}</span>
                    {p.status === "hidden" && (
                      <span className="px-1.5 rounded bg-surface-container-high text-on-surface-variant text-[11px] font-semibold">숨김</span>
                    )}
                    {p.coldChain && (
                      <span className="px-1.5 rounded bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-semibold">냉장</span>
                    )}
                  </div>
                  <Link href={`/admin/products/${p.id}`} className="block font-label-md text-label-md text-on-surface truncate hover:underline">
                    {p.name}
                  </Link>
                  <p className="font-body-sm text-body-sm text-on-surface-variant tabular-nums">
                    {rate > 0 && <span className="text-tertiary-container font-bold mr-1">{rate}%</span>}
                    {won(p.price)}
                    <span className="mx-1.5 text-outline-variant">|</span>
                    <span className={p.stock === 0 ? "text-error font-semibold" : p.stock <= 10 ? "text-secondary font-semibold" : ""}>
                      {p.stock === 0 ? "품절" : `재고 ${p.stock}개`}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-1.5 shrink-0">
                  <form action={toggleProductStatus}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      className={
                        "h-9 px-3 rounded-lg font-label-sm text-label-sm w-full " +
                        (p.status === "active"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-surface-container text-on-surface-variant")
                      }
                      title="눌러서 판매중/숨김 전환"
                    >
                      {p.status === "active" ? "판매중" : "숨김"}
                    </button>
                  </form>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="h-9 px-3 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm inline-flex items-center justify-center"
                  >
                    수정
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
