import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import PostForm from "../PostForm";
import { PageTitle } from "../../../_components/ui";

export const metadata: Metadata = { title: "글쓰기" };

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <>
      <PageTitle title="글쓰기" />
      <PostForm />
    </>
  );
}
