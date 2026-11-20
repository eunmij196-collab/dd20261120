export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 w-full z-50 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-4px_16px_rgba(28,35,49,0.05)]"
      data-active-classes="text-primary-container font-bold"
    >
      <div className="flex justify-around items-center h-16 px-gutter-mobile">
        <a
          aria-label="홈"
          className="flex flex-col items-center justify-center w-14 h-14 text-on-surface-variant hover:text-on-surface transition-colors"
          data-path="home-feed"
          href="#"
        >
          <span className="material-symbols-outlined text-[24px]">cottage</span>
          <span className="font-label-sm text-[11px] mt-0.5">홈</span>
        </a>
        <a
          aria-label="카테고리"
          className="flex flex-col items-center justify-center w-14 h-14 text-on-surface-variant hover:text-on-surface transition-colors"
          data-path="all-categories"
          href="#"
        >
          <span className="material-symbols-outlined text-[24px]">grid_view</span>
          <span className="font-label-sm text-[11px] mt-0.5">카테고리</span>
        </a>
        <a
          aria-current="page"
          aria-label="명절특가"
          className="flex flex-col items-center justify-center w-14 h-14 transition-colors text-primary-container font-bold"
          data-path="holiday-gift-sets"
          href="#"
        >
          <span className="material-symbols-outlined text-[24px] text-secondary">featured_seasonal_and_gifts</span>
          <span className="font-label-sm text-[11px] mt-0.5 font-bold text-secondary">명절특가</span>
        </a>
        <a
          aria-label="찜 및 장바구니"
          className="flex flex-col items-center justify-center w-14 h-14 text-on-surface-variant hover:text-on-surface transition-colors relative"
          data-path="cart-wishlist"
          href="#"
        >
          <span className="material-symbols-outlined text-[24px]">favorite_border</span>
          <span className="font-label-sm text-[11px] mt-0.5">찜/장바구니</span>
        </a>
        <a
          aria-label="마이페이지"
          className="flex flex-col items-center justify-center w-14 h-14 text-on-surface-variant hover:text-on-surface transition-colors"
          data-path="my-page"
          href="#"
        >
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span className="font-label-sm text-[11px] mt-0.5">마이</span>
        </a>
      </div>
    </nav>
  );
}
