// 관리자 화면에서 사진을 올리는 도우미 (브라우저에서 실행)
// 큰 사진은 올리기 전에 긴 변 1920px, JPG로 줄여서 빠르게 올라가게 합니다.

const MAX_SIDE = 1920;
const MAX_BYTES = 4 * 1024 * 1024;
const KEEP_AS_IS = ["image/gif"]; // 움직이는 GIF는 줄이지 않음

async function shrink(file: File): Promise<Blob> {
  try {
    return await shrinkOrKeep(file);
  } catch {
    return file;
  }
}

async function shrinkOrKeep(file: File): Promise<Blob> {
  if (KEEP_AS_IS.includes(file.type)) return file;
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file; // 브라우저가 못 여는 형식(HEIC 등)은 그대로 보내고, 서버가 판정
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  // 이미 작고 가벼운 사진은 그대로 (PNG 투명 배경 유지)
  if (scale === 1 && file.size <= 1.5 * 1024 * 1024) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff"; // 투명 부분은 흰색으로
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
  return blob && blob.size < file.size ? blob : file;
}

/** 사진 한 장을 올리고 주소(/media/…)를 돌려줍니다. 실패하면 이유를 담은 오류를 던집니다. */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/") && file.type !== "") throw new Error(`'${file.name}'은(는) 사진 파일이 아닙니다.`);
  const blob = await shrink(file);
  if (blob.size > MAX_BYTES) throw new Error(`'${file.name}'이(가) 너무 큽니다. 4MB 이하 사진을 올려 주세요.`);

  const fd = new FormData();
  const name = blob === file ? file.name : file.name.replace(/\.[^.]+$/, "") + ".jpg";
  // 디스크의 파일을 그대로 보내지 않고 메모리로 한 번 읽어서 보냅니다 (일부 브라우저의 전송 오류 방지).
  let body: Blob;
  try {
    body = new Blob([await blob.arrayBuffer()], { type: blob.type || "application/octet-stream" });
  } catch {
    throw new Error(`'${file.name}' 파일을 읽지 못했습니다. 사진을 다시 골라 주세요.`);
  }
  fd.append("file", body, name);

  let res: Response;
  try {
    res = await fetch("/admin/upload", { method: "POST", body: fd });
  } catch {
    throw new Error("인터넷 연결을 확인하고 다시 시도해 주세요.");
  }
  if (res.redirected) throw new Error("로그인이 끝났습니다. 다시 로그인한 뒤 올려 주세요.");
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "사진을 올리지 못했습니다.");
  return data.url;
}

/** 붙여넣기·끌어놓기에서 사진 파일만 골라냅니다. */
export function imageFiles(list: FileList | null | undefined) {
  return Array.from(list ?? []).filter((f) => f.type.startsWith("image/"));
}
