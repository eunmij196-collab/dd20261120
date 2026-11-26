"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "대시보드", icon: "dashboard" },
  { href: "/admin/products", label: "상품 관리", icon: "inventory_2" },
  { href: "/admin/orders", label: "주문 관리", icon: "receipt_long" },
  { href: "/admin/shipping", label: "배송 관리", icon: "local_shipping" },
  { href: "/admin/blog", label: "블로그", icon: "edit_note" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex md:flex-col gap-1 overflow-x-auto -mx-1 px-1">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              "flex items-center gap-2 px-3 h-10 rounded-lg whitespace-nowrap font-label-md text-label-md transition-colors " +
              (active ? "bg-primary-container text-on-primary" : "text-on-surface-variant hover:bg-surface-container")
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
