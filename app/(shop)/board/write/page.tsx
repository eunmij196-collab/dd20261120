import type { Metadata } from "next";
import { WriteForm } from "../BoardForms";

export const metadata: Metadata = {
  title: "글쓰기 | 고객 게시판",
  robots: { index: false, follow: true },
};

export default function BoardWritePage() {
  return (
    <div className="px-margin-mobile max-w-3xl mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-primary mt-space-md mb-space-lg">게시판 글쓰기</h1>
      <WriteForm />
    </div>
  );
}
