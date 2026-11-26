/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-28 flex flex-col justify-between">
        <div className="h-16 px-margin-mobile flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <a href="#" data-path="home-feed" className="flex items-center">
              <img
                src="https://lh3.googleusercontent.com/aida/ALJJyrBGxc7Jk_cTlPZC-OvZzt8cFPutyX-fjTRSSini5hvghccJ9W7_7Bd6nBSdQ0dmwKsjnXKXuv-1ICXR9TCLZ9FMawEcJuHzwaCdw9IW6kIYYaLWDoXW_lnPEEOdx5egNRosaVLpU8d388aNIY0uzTWFAtmJ_fwGbGbQYlANp5LAQ57NOfPPugQpkET5sC1TYb82R0taL-K44J3xa5qqce5fo5wrgi-Z1xgSRBe4nUTm"
                alt="JANDA 경남명품향토몰"
                className="h-8 object-contain"
              />
            </a>
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
              className="w-11 h-11 flex items-center justify-center text-on-surface pl-1"
              data-path="my-page"
              href="#"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida/ALJJyrCTOIw1d-KQAZQf3JWiucDoLB23-ibMQiE1mtnKIvcI1bqKcZtMKJz2PjgFFxg6gNzw6A-XahzxSb2SqT8tgDzNIr_pVpKxWlcVfBKt8fMht_d8niMnwBpFoTCEYfRuEafyT7YtyjaEpQftZ5iryJHX_FqF8zqrLTQhRXplrdi6gM6zZnzA8EbkAHW-KC-R7fLg9FeCXlGDdDoyKYDEhWH8C2LFftEnQK3JKsyxlyJT"
              />
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
