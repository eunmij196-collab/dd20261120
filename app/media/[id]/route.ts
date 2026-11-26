// 올린 사진 보여주기: GET /media/<id>
// 사진은 한 번 올리면 바뀌지 않으므로 브라우저·Vercel CDN에 1년 동안 캐시합니다.
import { getImage } from "@/lib/media";

export async function GET(_request: Request, { params }: RouteContext<"/media/[id]">) {
  const { id } = await params;
  let image: Awaited<ReturnType<typeof getImage>> = null;
  try {
    image = await getImage(id);
  } catch (e) {
    console.error("사진 읽기 실패:", e);
    return new Response("사진을 불러오지 못했습니다.", { status: 500 });
  }
  if (!image) return new Response("사진을 찾을 수 없습니다.", { status: 404 });

  return new Response(new Uint8Array(image.bytes), {
    headers: {
      "Content-Type": image.mime,
      "Content-Length": String(image.bytes.length),
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
