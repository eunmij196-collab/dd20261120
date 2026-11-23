"use client";

import { useState, type FormEvent } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

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

function matchesPrice(key: PriceKey, price: number) {
  if (key === "all") return true;
  if (key === "30000") return price >= 30000 && price < 50000;
  if (key === "50000") return price >= 50000 && price < 100000;
  if (key === "100000") return price >= 100000 && price < 200000;
  return price >= 200000;
}

const FILL = { fontVariationSettings: '"FILL" 1' };

export default function HolidayGiftHome({ products }: { products: Product[] }) {
  const [currentPrice, setCurrentPrice] = useState<PriceKey>("all");
  const [currentTarget, setCurrentTarget] = useState<TargetKey>("all");
  const [filtered, setFiltered] = useState(false);
  const [cartItem, setCartItem] = useState<{ title: string; price: string } | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);

  const visible = products.map(
    (m) =>
      matchesPrice(currentPrice, m.price) &&
      (currentTarget === "all" || m.targets.includes(currentTarget)),
  );
  const visibleCount = visible.filter(Boolean).length;

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
              {filtered ? `${visibleCount}개 상품 표시` : `전체 (총 ${products.length}종)`}
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
        {products.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            featured={i === 0}
            hidden={!visible[i]}
            onCart={toggleCartModal}
            onOrder={directOrder}
          />
        ))}
        {visibleCount === 0 && (
          <p className="py-space-lg text-center font-body-md text-body-md text-on-surface-variant">
            {products.length === 0 ? "준비 중인 상품입니다. 곧 찾아뵙겠습니다." : "조건에 맞는 상품이 없습니다. 다른 가격대나 대상을 선택해 보세요."}
          </p>
        )}
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
