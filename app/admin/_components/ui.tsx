import type { OrderStatus } from "@/lib/types";
import { statusClass, statusLabel } from "@/lib/format";

export function PageTitle({ title, desc, children }: { title: string; desc?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-space-lg">
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
        "inline-flex px-2 py-0.5 rounded-full font-label-sm text-[12px] font-semibold whitespace-nowrap " +
        statusClass[status]
      }
    >
      {statusLabel[status]}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={"bg-surface-container-lowest rounded-2xl shadow-sm p-4 md:p-5 " + className}>{children}</section>
  );
}

export function SampleNotice() {
  return (
    <p className="mb-space-md px-3 py-2 rounded-lg bg-secondary-container/50 text-on-secondary-container font-body-sm text-body-sm">
      지금 보이는 주문은 화면 확인용 <b>샘플</b>입니다. 쇼핑몰에 결제 기능이 연결되면 실제 주문이 여기에 쌓입니다.
    </p>
  );
}

export const inputClass =
  "h-10 px-3 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-2 focus:outline-secondary";
export const btnPrimary =
  "inline-flex items-center justify-center gap-1 h-10 px-4 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-60";
export const btnSecondary =
  "inline-flex items-center justify-center gap-1 h-10 px-4 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high";
