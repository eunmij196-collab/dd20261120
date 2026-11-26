import type { OrderStatus } from "@/lib/types";
import { statusClass, statusLabel } from "@/lib/format";

// 관리자 화면 공통 스타일 (DESIGN.md "Gyeongnam Heritage Harvest" 기준)
//  - 카드: 흰 바탕 + 1px 한지 테두리(#E8DFD0), 그림자 없음, 모서리 4px
//  - 입력칸·버튼: 높이 48px 이상, 포커스 시 먹색(#1C2331) 테두리

export function PageTitle({ title, desc, children }: { title: string; desc?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-space-lg pb-space-md border-b border-hanji">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary">{title}</h1>
        {desc && <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={
        "inline-flex px-2 py-0.5 rounded font-label-sm text-[12px] font-semibold whitespace-nowrap " + statusClass[status]
      }
    >
      {statusLabel[status]}
    </span>
  );
}

export const cardClass = "bg-surface-container-lowest border border-hanji rounded-lg";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`${cardClass} p-4 md:p-5 ${className}`}>{children}</section>;
}

export function SampleNotice() {
  return (
    <p className="mb-space-md px-3 py-2 rounded-lg border border-secondary-fixed-dim bg-secondary-fixed/40 text-on-secondary-fixed-variant font-body-sm text-body-sm">
      지금 보이는 주문은 화면 확인용 <b>샘플</b>입니다. 쇼핑몰에 결제 기능이 연결되면 실제 주문이 여기에 쌓입니다.
    </p>
  );
}

export function EmptyState({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className={`${cardClass} py-12 px-4 flex flex-col items-center gap-2 text-center text-on-surface-variant`}>
      <span className="material-symbols-outlined text-[36px] text-secondary-fixed-dim">{icon}</span>
      <p className="font-body-md text-body-md">{children}</p>
    </div>
  );
}

export function ErrorNotice({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="px-3 py-2 rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm">
      {children}
    </p>
  );
}

export const inputClass =
  "h-12 px-3 rounded-lg border border-hanji bg-surface-container-lowest text-on-surface placeholder:text-[#8c827a] focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container";
export const btnPrimary =
  "inline-flex items-center justify-center gap-1 h-12 px-5 rounded-lg bg-primary-container text-background font-label-lg text-label-lg hover:bg-primary disabled:opacity-60";
export const btnSecondary =
  "inline-flex items-center justify-center gap-1 h-12 px-5 rounded-lg border-[1.5px] border-[#c5a059] bg-background text-primary-container font-label-lg text-label-lg hover:bg-secondary-fixed/40";
export const btnDanger =
  "inline-flex items-center justify-center gap-1 h-12 px-5 rounded-lg border border-error/40 text-error font-label-lg text-label-lg hover:bg-error-container";
/** 목록 안의 작은 버튼 (높이 40px) */
export const btnSmall =
  "inline-flex items-center justify-center gap-1 h-10 px-3 rounded-lg border border-hanji bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:border-primary-container";
export const btnSmallDanger =
  "inline-flex items-center justify-center gap-1 h-10 px-3 rounded-lg border border-hanji bg-surface-container-lowest text-error font-label-md text-label-md hover:bg-error-container hover:border-error/40";
