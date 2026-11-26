/* eslint-disable @next/next/no-img-element */
import { safeImageUrl } from "@/lib/blog";

// 블로그 본문을 화면에 그립니다. HTML은 그대로 글자로 보여 주므로 안전합니다.
//   빈 줄 = 문단 나눔 · "## " = 소제목 · "- " = 목록 · "![설명](사진주소)" = 사진
export default function PostContent({ content }: { content: string }) {
  const blocks = content
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-4 font-body-md text-body-md text-on-surface leading-relaxed">
      {blocks.map((block, i) => {
        const image = block.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
        if (image) {
          const src = safeImageUrl(image[2]);
          return src ? (
            <figure key={i} className="flex flex-col gap-1">
              <img src={src} alt={image[1]} className="w-full rounded-xl" loading="lazy" />
              {image[1] && (
                <figcaption className="text-center font-body-sm text-body-sm text-on-surface-variant">{image[1]}</figcaption>
              )}
            </figure>
          ) : null;
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="font-headline-md text-headline-md text-primary mt-2">
              {block.slice(3)}
            </h2>
          );
        }
        const lines = block.split("\n");
        if (lines.every((l) => /^[-*] /.test(l))) {
          return (
            <ul key={i} className="list-disc pl-5 flex flex-col gap-1">
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {block}
          </p>
        );
      })}
    </div>
  );
}
