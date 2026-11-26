import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBoardPost } from "@/lib/board";
import { EditForm } from "../../BoardForms";

export const metadata: Metadata = {
  title: "글 수정 | 고객 게시판",
  robots: { index: false, follow: false },
};

async function Edit({ params }: { params: PageProps<"/board/[id]/edit">["params"] }) {
  const { id } = await params;
  const post = await getBoardPost(id);
  if (!post) notFound();
  return <EditForm post={{ id: post.id, title: post.title, content: post.content }} />;
}

export default function BoardEditPage({ params }: PageProps<"/board/[id]/edit">) {
  return (
    <div className="px-margin-mobile max-w-3xl mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-primary mt-space-md mb-space-lg">게시판 글 수정</h1>
      <Suspense fallback={<p className="text-on-surface-variant py-16 text-center">불러오는 중…</p>}>
        <Edit params={params} />
      </Suspense>
    </div>
  );
}
