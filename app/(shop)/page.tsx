import type { Metadata } from "next";
import HolidayGiftHome from "../HolidayGiftHome";
import { getShopProducts } from "@/lib/shop";
import { SITE_URL } from "@/lib/site";

const title = "경남명품향토몰 | 경남 특산물 명절 선물세트";
const description =
  "밀양 사과, 산청 곶감, 남해 죽방렴 멸치, 하동 녹차, 의령 망개떡 등 경남 특산물 명절 선물세트를 만나보세요.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "경남명품향토몰",
    url: "/",
    title,
    description,
    images: ["/products/gn4-set.jpg"],
  },
};

export default async function Home() {
  const products = await getShopProducts();
  return <HolidayGiftHome products={products} />;
}
