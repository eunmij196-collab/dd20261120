"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */

import { useState, type FormEvent } from "react";

type PriceKey = "all" | "30000" | "50000" | "100000" | "200000";
type TargetKey = "all" | "parents" | "vip" | "bulk" | "health";

const priceFilters: { key: PriceKey; label: string }[] = [
  { key: "all", label: "전체 보기" },
  { key: "30000", label: "3만 원대 실속형" },
  { key: "50000", label: "5만 원대 인기형" },
  { key: "100000", label: "10만 원대 프리미엄" },
  { key: "200000", label: "20만 원 이상 VIP 명작" },
];

const targetFilters: { key: TargetKey; label: string; icon?: string }[] = [
  { key: "all", label: "전체 대상" },
  { key: "parents", label: "부모님·친척", icon: "elderly" },
  { key: "vip", label: "VIP 거래처", icon: "diamond" },
  { key: "bulk", label: "직원복지·단체", icon: "groups" },
  { key: "health", label: "건강·효도", icon: "favorite" },
];

// 각 상품 카드의 가격·대상 (code.html의 data-price / data-target)
const cardMeta: { price: number; targets: TargetKey[] }[] = [
  { price: 89000, targets: ["vip", "parents"] },
  { price: 49000, targets: ["parents", "health"] },
  { price: 37800, targets: ["bulk", "parents"] },
  { price: 78000, targets: ["vip", "health"] },
  { price: 35000, targets: ["parents", "bulk"] },
  { price: 38000, targets: ["parents", "bulk", "health"] },
];

function matchesPrice(key: PriceKey, price: number) {
  if (key === "all") return true;
  if (key === "30000") return price >= 30000 && price < 50000;
  if (key === "50000") return price >= 50000 && price < 100000;
  if (key === "100000") return price >= 100000 && price < 200000;
  return price >= 200000;
}

const FILL = { fontVariationSettings: '"FILL" 1' };

export default function HolidayGiftHome() {
  const [currentPrice, setCurrentPrice] = useState<PriceKey>("all");
  const [currentTarget, setCurrentTarget] = useState<TargetKey>("all");
  const [filtered, setFiltered] = useState(false);
  const [cartItem, setCartItem] = useState<{ title: string; price: string } | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);

  const visible = cardMeta.map(
    (m) =>
      matchesPrice(currentPrice, m.price) &&
      (currentTarget === "all" || m.targets.includes(currentTarget)),
  );
  const visibleCount = visible.filter(Boolean).length;
  const cardHidden = (i: number) => (visible[i] ? "" : " hidden");

  function toggleCartModal(title: string, price: string) {
    setCartItem({ title, price });
  }

  function closeCartModal() {
    setCartItem(null);
  }

  function goToCart() {
    closeCartModal();
    const cartTrigger = document.querySelector<HTMLAnchorElement>('a[data-path="cart-wishlist"]');
    if (cartTrigger) {
      cartTrigger.click();
    } else {
      alert("선택하신 명절 선물세트가 장바구니에 담겼습니다.");
    }
  }

  function directOrder(title: string) {
    alert(`[${title}] 품격 보자기 포장 옵션과 함께 주문 결제 페이지로 이동합니다.`);
  }

  function submitBulkForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("견적서 신청이 완료되었습니다. 담당 MD가 10분 내로 기재하신 연락처로 연락드리겠습니다.");
    setBulkOpen(false);
  }

  return (
    <div className="flex flex-col w-full">
      {/* 1. Curation Header & Festive Hanji Banner */}
      <section className="relative px-margin-mobile pt-space-md pb-space-lg bg-surface-container-low overflow-hidden">
        {/* Subtle Traditional Motifs Background */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-36 h-36 rounded-full bg-tertiary-fixed/15 blur-xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col gap-space-xs">
          <div className="inline-flex items-center gap-1.5 self-start px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[15px]" style={FILL}>
              stars
            </span>
            <span>2026 명절 특별 기획전</span>
          </div>
          <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-primary tracking-tight mt-1">
            마음을 전하는 격조,
            <br />
            <span className="text-secondary font-bold">2026 경남 명절 선물세트</span>
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-1">
            경남 18개 시·군의 정직한 명품만을 엄선하여 장인의 정성 어린 고급 보자기 포장과 산지 직송 신선함으로 소중한 분께 전합니다.
          </p>
          {/* Trust Badges Strip */}
          <div className="grid grid-cols-3 gap-2 mt-space-md">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface shadow-sm">
              <span className="material-symbols-outlined text-secondary text-[20px]" style={FILL}>
                workspace_premium
              </span>
              <div className="min-w-0">
                <p className="font-label-sm text-[11px] text-on-surface-variant">경남도지사 인증</p>
                <p className="font-label-md text-label-md text-on-surface truncate">100% 지자체 엄선</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface shadow-sm">
              <span className="material-symbols-outlined text-secondary text-[20px]" style={FILL}>
                inventory_2
              </span>
              <div className="min-w-0">
                <p className="font-label-sm text-[11px] text-on-surface-variant">전통 수제 매듭</p>
                <p className="font-label-md text-label-md text-on-surface truncate">보자기 포장 무료</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface shadow-sm">
              <span className="material-symbols-outlined text-secondary text-[20px]" style={FILL}>
                local_shipping
              </span>
              <div className="min-w-0">
                <p className="font-label-sm text-[11px] text-on-surface-variant">우체국 특송</p>
                <p className="font-label-md text-label-md text-on-surface truncate">명절 지정일 배송</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dual Filtering Bar: Price Range & Recipient Persona */}
      <section className="sticky top-28 z-40 bg-surface/95 backdrop-blur-md py-space-sm px-margin-mobile shadow-[0_4px_12px_rgba(0,0,0,0.03)] space-y-2.5">
        {/* Price Range Filter Chips */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
              가격대별 선택
            </span>
            <span className="font-label-sm text-[11px] text-secondary font-semibold" id="activeFilterBadge">
              {filtered ? `${visibleCount}개 상품 표시` : "전체 (총 6종)"}
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 -mx-margin-mobile px-margin-mobile"
            id="priceFilters"
          >
            {priceFilters.map((f, i) => {
              const active = currentPrice === f.key;
              return (
                <button
                  key={f.key}
                  className={
                    `filter-btn${i === 0 ? " active" : ""} shrink-0 px-3 py-1.5 rounded-full font-label-md text-label-md ` +
                    (active ? "bg-primary-container text-surface" : "bg-surface-container text-on-surface") +
                    (i === 0 ? " shadow-sm" : " hover:bg-surface-container-high") +
                    " transition-all"
                  }
                  data-price={f.key}
                  type="button"
                  onClick={() => {
                    setCurrentPrice(f.key);
                    setFiltered(true);
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* Recipient Persona Filter Chips */}
        <div className="pt-1">
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
            받는 분 맞춤
          </span>
          {/* 시안(Tailwind v3)의 space-y-1 간격과 같게 mt-1 사용 */}
          <div
            className="mt-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 -mx-margin-mobile px-margin-mobile"
            id="targetFilters"
          >
            {targetFilters.map((f, i) => {
              const active = currentTarget === f.key;
              return (
                <button
                  key={f.key}
                  className={
                    `target-btn${i === 0 ? " active" : ""} shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm ` +
                    (active
                      ? "bg-surface-container-highest text-on-surface font-semibold"
                      : "bg-surface-container-low text-on-surface-variant") +
                    (i === 0 ? "" : " hover:text-on-surface")
                  }
                  data-target={f.key}
                  type="button"
                  onClick={() => {
                    setCurrentTarget(f.key);
                    setFiltered(true);
                  }}
                >
                  {f.icon && <span className="material-symbols-outlined text-[15px]">{f.icon}</span>}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Signature Gift Sets Grid List */}
      <section className="px-margin-mobile py-space-md space-y-space-md" id="giftCatalog">
        {/* Item 1: Flagship 4-Item Combo Set (VIP / Premium) */}
        <article
          className={"gift-card bg-surface-container-lowest rounded-xl shadow-sm p-3.5 flex flex-col gap-3 relative overflow-hidden" + cardHidden(0)}
          data-price="89000"
          data-target="vip parents"
        >
          {/* Bojagi Accents Badge */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
            <span className="px-2 py-0.5 rounded-sm bg-primary text-on-primary font-label-sm text-[11px] font-bold shadow-sm">
              주력 추천 1위
            </span>
            <span className="px-2 py-0.5 rounded-sm bg-secondary text-on-secondary font-label-sm text-[11px] font-semibold">
              보자기 매듭 무료
            </span>
          </div>
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-surface-container">
            <img
              className="w-full h-full object-cover"
              data-alt="Traditional luxury Korean Chuseok holiday gift box containing Miryang crisp sweet apples, Sancheong dried black persimmons, Namhae dried silver anchovies, and Hadong artisanal green tea neatly arranged in a paulownia wooden box with a royal blue silk bojagi wrapping cloth tied in an intricate lotus blossom knot, warm heritage studio lighting."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8fQKP4JQcxA6qOm5QP-aivlrV-uIs8AxEIkIanzBvnDfp7HrEeNClliJ_DHq8HE1Z8yVeL8MRoU-LvEnpyzen3Ec9EoieXc2lwLxUIy-0RQeAd86mpzPIbQvikA_J3fv4O079s-Ax3mxk5U9GIhSIrmr7VQkMlsbyO4CYs4VWie3amSdyG0G06RhCWHSnytYRDUilUbJNow97JB_adimy2etO5xOWF0EVxltNeJ0"
            />
            <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-primary/80 backdrop-blur-sm text-surface font-label-sm text-[11px] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">local_shipping</span>
              <span>무료 냉장특송</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
              <span className="px-1.5 py-0.5 rounded bg-surface-container font-medium text-secondary">경남 통합 명품관</span>
              <span>밀양 · 산청 · 남해 · 하동</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold leading-snug">
              [경남 4선 종합 명품세트] 밀양 사과 &amp; 산청 곶감 &amp; 남해 은멸치 &amp; 하동 수제차
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              경남의 명산과 바다가 빚어낸 4대 대표 특산물을 정갈한 오동나무 함에 담았습니다. 명절 격식 있는 선물로 가장 선호되는 종합 명작입니다.
            </p>
            {/* Pricing with Discount */}
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-tertiary-container font-extrabold">15%</span>
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">89,000원</span>
              <span className="font-body-sm text-body-sm text-outline line-through">105,000원</span>
            </div>
            {/* Corporate / Bulk indicator */}
            <div className="mt-2 p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between text-on-surface-variant">
              <div className="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span>대량 구매 10+1 혜택 · 견적서 즉시 발급</span>
              </div>
              <span className="text-[11px] text-outline">세금계산서 가능</span>
            </div>
            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                className="h-11 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 active:bg-surface-container-high transition-colors"
                onClick={() => toggleCartModal("경남 4선 종합 명품세트", "89,000")}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>장바구니 담기</span>
              </button>
              <button
                className="h-11 rounded-lg bg-primary-container text-surface font-label-md text-label-md flex items-center justify-center gap-1 active:opacity-90 shadow-sm transition-all"
                onClick={() => directOrder("경남 4선 종합 명품세트")}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">card_giftcard</span>
                <span>보자기 선물 주문</span>
              </button>
            </div>
          </div>
        </article>

        {/* Item 2: Sancheong Black Dried Persimmons (Health / Parents) */}
        <article
          className={"gift-card bg-surface-container-lowest rounded-xl shadow-sm p-3.5 flex flex-col gap-3 relative overflow-hidden" + cardHidden(1)}
          data-price="49000"
          data-target="parents health"
        >
          <div className="absolute top-3 left-3 z-10 flex gap-1">
            <span className="px-2 py-0.5 rounded-sm bg-secondary text-on-secondary font-label-sm text-[11px] font-bold">지리산 청정자연</span>
          </div>
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-surface-container">
            <img
              className="w-full h-full object-cover"
              data-alt="Premium Korean dried black persimmons from Jirisan Deoksan, glossy translucent amber-black dried fruit arranged in neat grid compartments of a traditional craft box decorated with fine gold Hanji paper ribbon and brass seal tag, soft ambient lighting."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcA5LSk2NmODnxRXoP2HiC3h1PL4QgFelAGs6ze58M4eP8Gy0MQWC__-oyhr_xPkUoprBfw0q5d6Dex8gkoAULAebvdYYPWglEVK9_NRue95UxW030Hcxq55pK9ys2n-qBL7FOnJXAZeU4CQj3ZCG1nn3uI7ytjJh-Tx4-yQGTUcMNo8OStrs-uzspLDm8RXTeN5Y9J9iJrtyBhGIsLFgkfWIz1kzXpJzSLzthx3c"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
              <span className="px-1.5 py-0.5 rounded bg-surface-container font-medium text-secondary">경남 산청군</span>
              <span>지리산 해풍과 청정한 일교차</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold leading-snug">
              [산청 지리산 덕산 흑곶감 정과 세트 24과]
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              자연 건조로 숙성되어 겉은 쫄깃하고 속은 꿀처럼 촉촉한 지리산 덕산 특품 곶감입니다. 부모님 건강 간식 및 다과상 선물로 제격입니다.
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-tertiary-container font-extrabold">11%</span>
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">49,000원</span>
              <span className="font-body-sm text-body-sm text-outline line-through">55,000원</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                className="h-11 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1"
                onClick={() => toggleCartModal("산청 지리산 흑곶감 정과 24과", "49,000")}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>담기</span>
              </button>
              <button
                className="h-11 rounded-lg bg-primary-container text-surface font-label-md text-label-md flex items-center justify-center gap-1"
                onClick={() => directOrder("산청 지리산 흑곶감 정과 24과")}
                type="button"
              >
                <span>바로 주문하기</span>
              </button>
            </div>
          </div>
        </article>

        {/* Item 3: Namhae Bamboo Weir Anchovy Set (Bulk / Practical) */}
        <article
          className={"gift-card bg-surface-container-lowest rounded-xl shadow-sm p-3.5 flex flex-col gap-3 relative overflow-hidden" + cardHidden(2)}
          data-price="37800"
          data-target="bulk parents"
        >
          <div className="absolute top-3 left-3 z-10 flex gap-1">
            <span className="px-2 py-0.5 rounded-sm bg-primary-container text-surface font-label-sm text-[11px] font-bold">국가어업유산 제3호</span>
          </div>
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-surface-container">
            <img
              className="w-full h-full object-cover"
              data-alt="Namhae traditional Jukbangryeom bamboo weir silver anchovies presented in three neat wooden craft jars inside a gift carton, showcasing sparkling unbroken silvery anchovies for stir-fry and rich broth, clean white and natural wood aesthetic."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNGCRczQRF_xu8HZiSt5cff4OHFae3jlK_qVhLn5WkjUxz6oZoKneCTOx7dZAvo17x090N4IoF0nJ9YRzk-S7qvfZ08BmpUjrKbmj9GPNsFLTdcC4ZqOaru-Cb7LCbwkjzdfYSb4AdT3mAR3eeSx-pGDptFck8t78stRrPLuGYPxd2eNXphys-khlP_cy1fE_ri7saw0zNYK5n2XhiNF4fu88IO1xQVyHInIrKVBA"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
              <span className="px-1.5 py-0.5 rounded bg-surface-container font-medium text-secondary">경남 남해군</span>
              <span>남해 청정 해역 전통 죽방렴</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold leading-snug">
              [남해 죽방렴 은빛 멸치 3종 세트] 볶음용 · 국물용 · 조림용
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              거센 조류에서 원형 그대로 건져 비늘 하나 상하지 않은 최고급 은빛 멸치입니다. 비린 맛 없이 고소하고 깊은 맛을 냅니다.
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-tertiary-container font-extrabold">10%</span>
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">37,800원</span>
              <span className="font-body-sm text-body-sm text-outline line-through">42,000원</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                className="h-11 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1"
                onClick={() => toggleCartModal("남해 죽방렴 은빛 멸치 3종", "37,800")}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>담기</span>
              </button>
              <button
                className="h-11 rounded-lg bg-primary-container text-surface font-label-md text-label-md flex items-center justify-center gap-1"
                onClick={() => directOrder("남해 죽방렴 은빛 멸치 3종")}
                type="button"
              >
                <span>바로 주문하기</span>
              </button>
            </div>
          </div>
        </article>

        {/* Item 4: Hadong Wild Green Tea & Jirisan Honey Earthenware Pot (VIP / Health) */}
        <article
          className={"gift-card bg-surface-container-lowest rounded-xl shadow-sm p-3.5 flex flex-col gap-3 relative overflow-hidden" + cardHidden(3)}
          data-price="78000"
          data-target="vip health"
        >
          <div className="absolute top-3 left-3 z-10 flex gap-1">
            <span className="px-2 py-0.5 rounded-sm bg-secondary-container text-on-secondary-fixed font-label-sm text-[11px] font-bold">명인 수작업</span>
          </div>
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-surface-container">
            <img
              className="w-full h-full object-cover"
              data-alt="Traditional handmade Korean earthenware jar filled with pure raw Jirisan wildflower honey paired alongside a canister of premium artisanal Hadong wild leaf green tea, displayed on a rustic linen bojagi cloth with miniature wooden tea scoop."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoUIs-ofQ-_DcajzLnAJ27GWSG0M5PoATIangEIIHu0yz_uIQgg10iBWF8Ibsm4cnw3RcCZHSN4qTwxORRuMId5tJ0maFPnk2dQtKbRhBCE7rsr9hA-w3oek_ZH9GqgbNdxwMjulj2yP_bTyl_05Ndxcx6ZlPZLr1HBFtzr-z9djgSrNI6usB-uRJiPe3wbS5NUEQE5CVHdFsZT8nzJXpCOcnO8y7XKS1KKOoR1Iw"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
              <span className="px-1.5 py-0.5 rounded bg-surface-container font-medium text-secondary">경남 하동군</span>
              <span>화개장터 1200년 야생차 시배지</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold leading-snug">
              [하동 야생 햇녹차 &amp; 지리산 천연 벌꿀 옹기 세트]
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              무쇠 솥에서 9번 덖은 명품 수제 녹차와 지리산 고지대에서 채밀한 천연 야생화 꿀을 숨 쉬는 전통 옹기에 담아 품격을 높였습니다.
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">78,000원</span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">고급 한지 지함 포장 포함</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                className="h-11 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1"
                onClick={() => toggleCartModal("하동 야생 햇녹차 & 벌꿀 옹기세트", "78,000")}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>담기</span>
              </button>
              <button
                className="h-11 rounded-lg bg-primary-container text-surface font-label-md text-label-md flex items-center justify-center gap-1"
                onClick={() => directOrder("하동 야생 햇녹차 & 벌꿀 옹기세트")}
                type="button"
              >
                <span>바로 주문하기</span>
              </button>
            </div>
          </div>
        </article>

        {/* Item 5: Traditional Fermented Sauce Master 3-Piece Set (Parents / Bulk) */}
        <article
          className={"gift-card bg-surface-container-lowest rounded-xl shadow-sm p-3.5 flex flex-col gap-3 relative overflow-hidden" + cardHidden(4)}
          data-price="35000"
          data-target="parents bulk"
        >
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-surface-container">
            <img
              className="w-full h-full object-cover"
              data-alt="Set of three mini traditional Korean earthenware pots containing slow-aged fermented soybean paste doenjang, red pepper paste gochujang, and rich soy sauce ganjang arranged on polished dark walnut tray with hanji cord."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEek5sxbUJlTAw3j8GnMtdZP4ziKEyIs1GavD476WgJLf0A6KdakGv-jROlOYo2kd-i0dhaWKqCUe_YCUTrKWVfCtNg3nFjO2i4TURU_kZPjH8o9GtLBvki7ej7Qc7BalrIpaC1tMQ5PIKXwzzgB3-UyFG_akY-RwbWAAZsejwio2U5jaa827ZXG5mmJoej6B50D7w5_6TtCCwHgS31ZIAob2lzUirbBTB5DfhCTU"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
              <span className="px-1.5 py-0.5 rounded bg-surface-container font-medium text-secondary">경남 합천 · 함양</span>
              <span>3년 자연 숙성 옹기 장류</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold leading-snug">
              [전통 장류 명가 3종 세트] 전통 항아리 된장 · 찹쌀 고추장 · 조선간장
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              국내산 토종 콩과 천일염으로 빚어 햇살 아래 3년 이상 익힌 깊은 감칠맛의 전통 장류 3종 세트입니다. 명절 차례상과 주방의 품격을 더합니다.
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">35,000원</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">실속 포장형 (선물 쇼핑백 동봉)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                className="h-11 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1"
                onClick={() => toggleCartModal("전통 장류 명가 3종 세트", "35,000")}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>담기</span>
              </button>
              <button
                className="h-11 rounded-lg bg-primary-container text-surface font-label-md text-label-md flex items-center justify-center gap-1"
                onClick={() => directOrder("전통 장류 명가 3종 세트")}
                type="button"
              >
                <span>바로 주문하기</span>
              </button>
            </div>
          </div>
        </article>

        {/* Item 6: Uiryeong Manggae-tteok & Han-gwa Set (Health / Bulk) */}
        <article
          className={"gift-card bg-surface-container-lowest rounded-xl shadow-sm p-3.5 flex flex-col gap-3 relative overflow-hidden" + cardHidden(5)}
          data-price="38000"
          data-target="parents bulk health"
        >
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-surface-container">
            <img
              className="w-full h-full object-cover"
              data-alt="Traditional Uiryeong artisanal Manggae rice cakes wrapped in fragrant green smilax leaves alongside colorful Korean puffed rice sweets hangwa and sesame yugwa inside a decorative lacquer-style holiday box."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm9CeE86KwW_NN0EDc1RjmTxG5uVKtCBwk3H1eUgkED2QdN6abFP4ow7qrNUVYUaqUE1glnj5bqxiApqW23c65Fk3mesxIW4dPiVWEu86-A9XLBjp4vWAegMraDoZ13pEPyevJJTX1mPexO6fSGSsXGCT5a3VyfNAvSYD6Yg1F2gdhItskP_0jpR0gQBlbHzoqsRTrfuZeVYdpVkij3wmYpGof0pvRpSqV2xZsh9Q"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
              <span className="px-1.5 py-0.5 rounded bg-surface-container font-medium text-secondary">경남 의령군</span>
              <span>당일 제조 급속 냉동 발송</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold leading-snug">
              [의령 전통 수제 망개떡 &amp; 오색 찹쌀 한과 세트]
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              망개잎의 은은한 향과 부드러운 팥소의 조화가 일품인 명물 망개떡과 100% 국산 조청으로 버무린 오색 찹쌀 한과를 풍성하게 담았습니다.
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">38,000원</span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">다과용 고급 선물 패키지</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                className="h-11 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1"
                onClick={() => toggleCartModal("의령 수제 망개떡 & 한과 세트", "38,000")}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>담기</span>
              </button>
              <button
                className="h-11 rounded-lg bg-primary-container text-surface font-label-md text-label-md flex items-center justify-center gap-1"
                onClick={() => directOrder("의령 수제 망개떡 & 한과 세트")}
                type="button"
              >
                <span>바로 주문하기</span>
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* 4. Safe Delivery & Corporate Assurance Section */}
      <section className="mt-space-lg px-margin-mobile space-y-space-md">
        {/* Delivery Schedule Assurance Banner */}
        <div className="p-space-md rounded-xl bg-surface-container shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary font-headline-md text-headline-md font-bold">
            <span className="material-symbols-outlined text-secondary text-[24px]">event_available</span>
            <span>2026 설 명절 배송 마감 캘린더</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            명절 연휴 전 안전한 수령을 위해 우체국 특송 전담팀이 산지에서 당일 발송합니다.
          </p>
          <div className="p-3 rounded-lg bg-surface space-y-2">
            <div className="flex items-center justify-between font-label-md text-label-md">
              <span className="text-on-surface-variant">일반 택배 배송 마감</span>
              <span className="font-bold text-tertiary-container">2월 11일(화) 18:00</span>
            </div>
            <div className="h-px bg-surface-variant"></div>
            <div className="flex items-center justify-between font-label-md text-label-md">
              <span className="text-on-surface-variant">산지 직송 신선 특송 마감</span>
              <span className="font-bold text-secondary">2월 12일(수) 14:00</span>
            </div>
            <div className="h-px bg-surface-variant"></div>
            <div className="flex items-center justify-between font-label-md text-label-md">
              <span className="text-on-surface-variant">수령 희망일 지정 서비스</span>
              <span className="font-bold text-on-surface">2월 8일 ~ 2월 13일 중 선택</span>
            </div>
          </div>
        </div>
        {/* Corporate Bulk Order & Customization Benefits */}
        <div className="p-space-md rounded-xl bg-secondary-container/30 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">corporate_fare</span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">기업 및 단체 주문 VIP 특전</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-on-surface">
            <div className="p-2.5 rounded bg-surface shadow-none flex flex-col gap-1">
              <div className="flex items-center gap-1 font-label-md text-label-md font-bold text-secondary">
                <span className="material-symbols-outlined text-[16px]">draw</span>
                <span>기업 로고 각인</span>
              </div>
              <p className="font-body-sm text-[12px] text-on-surface-variant">오동나무 상자 및 지함 겉면에 기업 CI 금박 무료 인쇄</p>
            </div>
            <div className="p-2.5 rounded bg-surface shadow-none flex flex-col gap-1">
              <div className="flex items-center gap-1 font-label-md text-label-md font-bold text-secondary">
                <span className="material-symbols-outlined text-[16px]">mail</span>
                <span>맞춤 감사장 동봉</span>
              </div>
              <p className="font-body-sm text-[12px] text-on-surface-variant">대표이사 명의 신년 인사말 한지 감사장 정성 동봉</p>
            </div>
            <div className="p-2.5 rounded bg-surface shadow-none flex flex-col gap-1">
              <div className="flex items-center gap-1 font-label-md text-label-md font-bold text-secondary">
                <span className="material-symbols-outlined text-[16px]">percent</span>
                <span>대량 수량별 할인</span>
              </div>
              <p className="font-body-sm text-[12px] text-on-surface-variant">30세트 이상 5%, 50세트 이상 10%, 100세트 이상 15%</p>
            </div>
            <div className="p-2.5 rounded bg-surface shadow-none flex flex-col gap-1">
              <div className="flex items-center gap-1 font-label-md text-label-md font-bold text-secondary">
                <span className="material-symbols-outlined text-[16px]">share_location</span>
                <span>개별 다중 배송</span>
              </div>
              <p className="font-body-sm text-[12px] text-on-surface-variant">엑셀 주소록 간편 등록으로 임직원 댁내 개별 직배송</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Floating Bottom Bulk Inquiry Sticky Anchor */}
      <section className="mt-space-lg mb-2 px-margin-mobile">
        <div className="p-space-md rounded-xl bg-primary-container text-surface flex flex-col gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-label-sm text-[12px] text-on-primary-container">대량 주문 전문 상담실</p>
              <p className="font-headline-md text-headline-md text-surface font-bold">대량 구매 견적 &amp; 단체 주문 문의</p>
            </div>
            <span className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">support_agent</span>
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-primary-container leading-relaxed">
            예산과 수량에 맞춘 경남 특산품 큐레이션 및 맞춤형 견적서를 실시간 10분 내로 발송해 드립니다.
          </p>
          <div className="flex gap-2">
            <a
              className="flex-1 h-12 rounded-lg bg-surface text-primary font-label-lg text-label-lg flex items-center justify-center gap-1 font-bold active:opacity-90 transition-opacity"
              href="tel:055-123-4567"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary">call</span>
              <span>전화 상담</span>
            </a>
            <button
              className="flex-1 h-12 rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-1 font-bold active:opacity-90 transition-opacity"
              onClick={() => setBulkOpen(true)}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">request_quote</span>
              <span>견적서 요청</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Modal for Cart / Gift Packaging Confirmation */}
      <div
        className={
          "fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm items-end justify-center p-0 transition-opacity" +
          (cartItem ? " flex" : " hidden")
        }
        id="cartModal"
      >
        <div className="w-full max-w-lg bg-surface rounded-t-2xl p-space-md shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold">장바구니 담기</span>
            </div>
            <button className="p-1 text-on-surface-variant" onClick={closeCartModal} type="button">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="p-3 rounded-lg bg-surface-container-low flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-surface flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[28px]">featured_seasonal_and_gifts</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-label-md text-label-md text-on-surface font-bold truncate" id="modalItemTitle">
                {cartItem ? cartItem.title : "선택한 명절 세트"}
              </p>
              <p className="font-label-sm text-label-sm text-secondary font-semibold" id="modalItemPrice">
                {cartItem ? `${cartItem.price}원 (보자기 포장 무료)` : "89,000원"}
              </p>
            </div>
          </div>
          {/* Packaging Selection Micro-Interaction */}
          <div className="space-y-2">
            <p className="font-label-sm text-label-sm text-on-surface font-semibold">포장 옵션 선택 (무료 제공)</p>
            <div className="grid grid-cols-2 gap-2">
              <label className="p-2.5 rounded-lg bg-surface-container flex items-center gap-2 cursor-pointer has-[:checked]:bg-secondary-container/40 has-[:checked]:text-on-surface font-label-sm text-label-sm">
                <input defaultChecked className="accent-primary w-4 h-4" name="packaging" type="radio" value="bojagi" />
                <span>궁중 비단 보자기 매듭</span>
              </label>
              <label className="p-2.5 rounded-lg bg-surface-container flex items-center gap-2 cursor-pointer has-[:checked]:bg-secondary-container/40 has-[:checked]:text-on-surface font-label-sm text-label-sm">
                <input className="accent-primary w-4 h-4" name="packaging" type="radio" value="hanji" />
                <span>친환경 지함 &amp; 한지띠</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              className="flex-1 h-12 rounded-lg bg-surface-container-high text-on-surface font-label-lg text-label-lg font-bold"
              onClick={closeCartModal}
              type="button"
            >
              쇼핑 계속하기
            </button>
            <button
              className="flex-1 h-12 rounded-lg bg-primary-container text-surface font-label-lg text-label-lg font-bold"
              onClick={goToCart}
              type="button"
            >
              장바구니 이동
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Modal for Corporate Estimate Request */}
      <div
        className={
          "fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm items-end justify-center p-0 transition-opacity" +
          (bulkOpen ? " flex" : " hidden")
        }
        id="bulkModal"
      >
        <div className="w-full max-w-lg bg-surface rounded-t-2xl p-space-md shadow-2xl flex flex-col gap-3.5 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-headline-md text-headline-md text-on-surface font-bold">대량 주문 &amp; 맞춤 견적 신청</span>
              <p className="font-body-sm text-[12px] text-on-surface-variant">담당자가 10분 내로 견적서 및 상담 전화를 드립니다.</p>
            </div>
            <button className="p-1 text-on-surface-variant" onClick={() => setBulkOpen(false)} type="button">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <form className="space-y-3" onSubmit={submitBulkForm}>
            <div>
              <label className="block font-label-sm text-[12px] text-on-surface-variant mb-1 font-semibold">회사명 / 단체명</label>
              <input
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container"
                placeholder="예: (주)경남상사"
                required
                type="text"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-label-sm text-[12px] text-on-surface-variant mb-1 font-semibold">담당자 성함</label>
                <input
                  className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container"
                  placeholder="홍길동 팀장"
                  required
                  type="text"
                />
              </div>
              <div>
                <label className="block font-label-sm text-[12px] text-on-surface-variant mb-1 font-semibold">연락처</label>
                <input
                  className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container"
                  placeholder="010-0000-0000"
                  required
                  type="tel"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-label-sm text-[12px] text-on-surface-variant mb-1 font-semibold">예상 수량</label>
                <select className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container">
                  <option>10 ~ 29 세트</option>
                  <option>30 ~ 49 세트 (5% DC)</option>
                  <option>50 ~ 99 세트 (10% DC)</option>
                  <option>100세트 이상 (15% DC)</option>
                </select>
              </div>
              <div>
                <label className="block font-label-sm text-[12px] text-on-surface-variant mb-1 font-semibold">희망 가격대(세트당)</label>
                <select className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container">
                  <option>3만 원 ~ 5만 원</option>
                  <option>5만 원 ~ 10만 원</option>
                  <option>10만 원 ~ 20만 원</option>
                  <option>20만 원 이상 VIP형</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-label-sm text-[12px] text-on-surface-variant mb-1 font-semibold">
                추가 요청 사항 (기업로고 각인 / 분할배송 등)
              </label>
              <textarea
                className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container"
                placeholder="필요하신 옵션이나 문의사항을 적어주세요."
                rows={2}
              ></textarea>
            </div>
            <button
              className="w-full h-12 rounded-lg bg-primary-container text-surface font-label-lg text-label-lg font-bold shadow-md active:opacity-90"
              type="submit"
            >
              견적 신청서 전송하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
