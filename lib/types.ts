export type Target = "parents" | "vip" | "bulk" | "health";

export type ProductStatus = "active" | "hidden";

export type Product = {
  id: string;
  name: string;
  region: string; // 산지 (예: 경남 산청군)
  tagline: string; // 산지 한 줄 소개
  description: string;
  imageUrl: string;
  price: number; // 판매가
  originalPrice: number | null; // 정가 (할인 전), 없으면 할인 없음
  badges: string[]; // 인증·뱃지 (예: 명인 수작업)
  targets: Target[];
  stock: number;
  status: ProductStatus;
  coldChain: boolean; // 냉장·냉동 발송 여부
  createdAt: string;
  updatedAt: string;
};

export type OrderStatus = "paid" | "preparing" | "shipping" | "delivered" | "cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; email: string };
  recipient: { name: string; phone: string; address: string };
  items: OrderItem[];
  total: number;
  deliveryDate: string; // 희망 배송일 YYYY-MM-DD
  wrapping: "bojagi" | "basic";
  giftMessage: string;
  status: OrderStatus;
  trackingNumber: string;
  memo: string; // 관리자 메모
  isSample?: boolean;
};

export type Db = {
  products: Product[];
  orders: Order[];
};
