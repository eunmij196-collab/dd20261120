import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { deleteProduct } from "../../../actions";
import ConfirmButton from "../../../_components/ConfirmButton";
import ProductForm from "../ProductForm";
import { PageTitle } from "../../../_components/ui";

export const metadata: Metadata = { title: "상품 수정" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { products } = await readDb();
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <>
      <PageTitle title="상품 수정" desc={product.name}>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <ConfirmButton
            message={`'${product.name}' 상품을 삭제할까요? 되돌릴 수 없습니다.`}
            className="h-10 px-4 rounded-lg text-error font-label-md text-label-md hover:bg-error-container"
          >
            상품 삭제
          </ConfirmButton>
        </form>
      </PageTitle>
      <ProductForm product={product} />
    </>
  );
}
