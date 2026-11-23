import HolidayGiftHome from "../HolidayGiftHome";
import { getShopProducts } from "@/lib/shop";

export default async function Home() {
  const products = await getShopProducts();
  return <HolidayGiftHome products={products} />;
}
