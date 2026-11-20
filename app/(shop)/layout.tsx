import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import BottomNav from "../components/BottomNav";

// 쇼핑몰 화면 전용 레이아웃 (관리자 화면에는 헤더·하단 메뉴를 표시하지 않음)
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 w-full bg-surface pt-28 pb-20">
        {children}
        <SiteFooter />
      </main>
      <BottomNav />
    </>
  );
}
