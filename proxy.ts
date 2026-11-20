import { NextResponse, type NextRequest } from "next/server";

// 로그인 쿠키가 없으면 관리자 화면 대신 로그인 화면으로 보냅니다.
// (빠른 1차 확인일 뿐이며, 실제 검증은 각 페이지·액션의 requireAdmin()에서 합니다.)
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();
  if (!request.cookies.has("admin_session")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
