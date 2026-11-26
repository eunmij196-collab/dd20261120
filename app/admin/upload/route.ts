// 관리자 사진 업로드: POST /admin/upload (form-data의 file 칸)
// 로그인한 관리자만 쓸 수 있고, 진짜 사진 파일(JPG·PNG·WEBP·GIF)만 받습니다.
import { isAdmin } from "@/lib/auth";
import { MAX_IMAGE_BYTES, detectImageType, saveImage } from "@/lib/media";
import { tursoConfigured } from "@/lib/turso";

const fail = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(request: Request) {
  if (!(await isAdmin())) return fail(401, "로그인이 필요합니다. 다시 로그인해 주세요.");
  if (!tursoConfigured()) return fail(500, "Turso 데이터베이스가 연결되지 않았습니다.");

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return fail(400, "사진을 받지 못했습니다. 다시 시도해 주세요.");
  }
  if (!(file instanceof File)) return fail(400, "사진 파일을 골라 주세요.");
  if (file.size > MAX_IMAGE_BYTES) return fail(413, "사진이 너무 큽니다. 4MB 이하로 올려 주세요.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = detectImageType(bytes);
  if (!mime) return fail(415, "JPG, PNG, WEBP, GIF 사진만 올릴 수 있습니다.");

  try {
    const { url } = await saveImage(bytes, mime, file.name);
    return Response.json({ url });
  } catch (e) {
    console.error("사진 저장 실패:", e);
    return fail(500, "사진을 저장하지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
  }
}
