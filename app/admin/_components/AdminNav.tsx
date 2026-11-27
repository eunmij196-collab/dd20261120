"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
  {
    label: "콘텐츠·제품",
    items: [
      { href: "/admin/blog", label: "블로그 관리", icon: "edit_note" },
      { href: "/admin/products", label: "제품 관리", icon: "inventory_2" },
      { href: "/admin/board", label: "게시판 관리", icon: "forum" },
    ],
  },
  {
    label: "운영",
    items: [
      { href: "/admin", label: "대시보드", icon: "dashboard" },
      { href: "/admin/orders", label: "주문 관리", icon: "receipt_long" },
      { href: "/admin/payments", label: "결제 주문", icon: "credit_card" },
      { href: "/admin/shipping", label: "배송 관리", icon: "local_shipping" },
    ],
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="관리 메뉴" className="flex md:flex-col gap-1 md:gap-5 overflow-x-auto no-scrollbar -mx-1 px-1">
      {groups.map((g) => (
        <div key={g.label} className="flex md:flex-col gap-1 shrink-0">
          <p className="hidden md:block px-3 mb-1 font-label-sm text-[12px] tracking-wider text-secondary-fixed-dim/80">
            {g.label}
          </p>
          {g.items.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  "relative flex items-center gap-2.5 px-3 h-12 rounded-lg whitespace-nowrap font-label-md text-label-md transition-colors " +
                  (active
                    ? "bg-white/10 text-secondary-fixed-dim before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[3px] before:rounded-sm before:bg-[#c5a059]"
                    : "text-inverse-primary hover:bg-white/5 hover:text-background")
                }
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
