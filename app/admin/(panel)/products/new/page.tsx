import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import ProductForm from "../ProductForm";
import { PageTitle } from "../../../_components/ui";

export const metadata: Metadata = { title: "상품 등록" };

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <PageTitle title="상품 등록" />
      <ProductForm />
    </>
  );
}
