import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-28 flex flex-col justify-between">
        <div className="h-16 px-margin-mobile flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            {/* 글자 로고 (외부 그림 주소가 막혀도 깨지지 않도록 그림 대신 글자로 표시) */}
            <Link href="/" aria-label="경남명품향토몰 홈" className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="w-8 h-8 shrink-0 rounded-[0.125rem] border border-[#c5a059] text-[#775a19] flex items-center justify-center font-headline-md text-[15px] leading-none"
              >
                향
              </span>
              <span className="font-headline-md text-[19px] leading-none text-primary tracking-tight">경남명품향토몰</span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <a
              aria-label="검색"
              className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-secondary transition-colors"
              data-path="product-search"
              href="#"
            >
              <span className="material-symbols-outlined text-[24px]">search</span>
            </a>
            <a
              aria-label="장바구니"
              className="relative w-11 h-11 flex items-center justify-center text-on-surface hover:text-secondary transition-colors"
              data-path="cart-wishlist"
              href="#"
            >
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              <span className="absolute top-2 right-1.5 min-w-[18px] h-[18px] px-1 bg-tertiary-container text-on-tertiary font-label-sm text-[10px] rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </a>
            <a
              aria-label="프로필"
              className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-secondary transition-colors"
              data-path="my-page"
              href="#"
            >
              <span className="material-symbols-outlined text-[26px]">account_circle</span>
            </a>
          </div>
        </div>
        <nav
          className="h-12 overflow-x-auto no-scrollbar flex items-center px-margin-mobile gap-space-md whitespace-nowrap"
          data-active-classes="text-primary-container font-bold border-b-2 border-primary-container"
        >
          <a
            className="h-full flex items-center font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
            data-path="home-feed"
            href="#"
          >
            전체/홈
          </a>
          <a
            aria-current="page"
            className="h-full flex items-center gap-1 transition-colors shrink-0 text-primary-container font-bold border-b-2 border-primary-container"
            data-path="holiday-gift-sets"
            href="#"
          >
            <span className="px-1.5 py-0.5 rounded-sm bg-secondary-container text-on-secondary-fixed text-[11px] font-bold">
              기획전
            </span>
            <span>명절 선물세트 ⭐</span>
          </a>
          <a
            className="h-full flex items-center font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
            data-path="agriculture-catalog"
            href="#"
          >
            농산물
          </a>
          <a
            className="h-full flex items-center font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
            data-path="fishery-catalog"
            href="#"
          >
            수산물
          </a>
          <a
            className="h-full flex items-center font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
            data-path="processed-foods"
            href="#"
          >
            가공식품
          </a>
          <a
            className="h-full flex items-center font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
            data-path="brand-origin-story"
            href="#"
          >
            브랜드·산지이야기
          </a>
          <Link
            className="h-full flex items-center font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
            href="/blog"
          >
            블로그
          </Link>
          <Link
            className="h-full flex items-center font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
            href="/board"
          >
            게시판
          </Link>
          <a
            className="h-full flex items-center font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
            data-path="cs-bulk-orders"
            href="#"
          >
            고객센터·대량문의
          </a>
        </nav>
      </div>
    </header>
  );
}
