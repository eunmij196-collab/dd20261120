import type { Db, Order, Product } from "./types";
import { todayKst } from "./format";

// 처음 실행할 때 data/db.json 이 없으면 이 데이터로 시작합니다.
// 상품은 현재 홈페이지의 6개 상품, 주문은 화면 확인용 샘플입니다.

export function createSeed(): Db {
  const now = new Date().toISOString();
  const p = (x: Omit<Product, "createdAt" | "updatedAt" | "status"> & { status?: Product["status"] }): Product => ({
    status: "active",
    createdAt: now,
    updatedAt: now,
    ...x,
  });

  const products: Product[] = [
    p({
      id: "p-gn4", name: "[경남 4선 종합 명품세트] 밀양 사과 & 산청 곶감 & 남해 은멸치 & 하동 수제차",
      region: "경남 통합 명품관", tagline: "밀양 · 산청 · 남해 · 하동",
      description: "경남의 명산과 바다가 빚어낸 4대 대표 특산물을 정갈한 오동나무 함에 담았습니다. 명절 격식 있는 선물로 가장 선호되는 종합 명작입니다.",
      imageUrl: "/products/gn4-set.jpg",
      price: 89000, originalPrice: 105000, badges: ["주력 추천 1위", "보자기 매듭 무료"],
      targets: ["vip", "parents"], stock: 120, coldChain: true,
    }),
    p({
      id: "p-persimmon", name: "[산청 지리산 덕산 흑곶감 정과 세트 24과]",
      region: "경남 산청군", tagline: "지리산 해풍과 청정한 일교차",
      description: "자연 건조로 숙성되어 겉은 쫄깃하고 속은 꿀처럼 촉촉한 지리산 덕산 특품 곶감입니다. 부모님 건강 간식 및 다과상 선물로 제격입니다.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcA5LSk2NmODnxRXoP2HiC3h1PL4QgFelAGs6ze58M4eP8Gy0MQWC__-oyhr_xPkUoprBfw0q5d6Dex8gkoAULAebvdYYPWglEVK9_NRue95UxW030Hcxq55pK9ys2n-qBL7FOnJXAZeU4CQj3ZCG1nn3uI7ytjJh-Tx4-yQGTUcMNo8OStrs-uzspLDm8RXTeN5Y9J9iJrtyBhGIsLFgkfWIz1kzXpJzSLzthx3c",
      price: 49000, originalPrice: 55000, badges: ["지리산 청정자연"],
      targets: ["parents", "health"], stock: 8, coldChain: true,
    }),
    p({
      id: "p-anchovy", name: "[남해 죽방렴 은빛 멸치 3종 세트] 볶음용 · 국물용 · 조림용",
      region: "경남 남해군", tagline: "남해 청정 해역 전통 죽방렴",
      description: "거센 조류에서 원형 그대로 건져 비늘 하나 상하지 않은 최고급 은빛 멸치입니다. 비린 맛 없이 고소하고 깊은 맛을 냅니다.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNGCRczQRF_xu8HZiSt5cff4OHFae3jlK_qVhLn5WkjUxz6oZoKneCTOx7dZAvo17x090N4IoF0nJ9YRzk-S7qvfZ08BmpUjrKbmj9GPNsFLTdcC4ZqOaru-Cb7LCbwkjzdfYSb4AdT3mAR3eeSx-pGDptFck8t78stRrPLuGYPxd2eNXphys-khlP_cy1fE_ri7saw0zNYK5n2XhiNF4fu88IO1xQVyHInIrKVBA",
      price: 37800, originalPrice: 42000, badges: ["국가어업유산 제3호"],
      targets: ["bulk", "parents"], stock: 200, coldChain: false,
    }),
    p({
      id: "p-tea", name: "[하동 야생 햇녹차 & 지리산 천연 벌꿀 옹기 세트]",
      region: "경남 하동군", tagline: "화개장터 1200년 야생차 시배지",
      description: "무쇠 솥에서 9번 덖은 명품 수제 녹차와 지리산 고지대에서 채밀한 천연 야생화 꿀을 숨 쉬는 전통 옹기에 담아 품격을 높였습니다.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoUIs-ofQ-_DcajzLnAJ27GWSG0M5PoATIangEIIHu0yz_uIQgg10iBWF8Ibsm4cnw3RcCZHSN4qTwxORRuMId5tJ0maFPnk2dQtKbRhBCE7rsr9hA-w3oek_ZH9GqgbNdxwMjulj2yP_bTyl_05Ndxcx6ZlPZLr1HBFtzr-z9djgSrNI6usB-uRJiPe3wbS5NUEQE5CVHdFsZT8nzJXpCOcnO8y7XKS1KKOoR1Iw",
      price: 78000, originalPrice: null, badges: ["명인 수작업"],
      targets: ["vip", "health"], stock: 45, coldChain: false,
    }),
    p({
      id: "p-jang", name: "[전통 장류 명가 3종 세트] 전통 항아리 된장 · 찹쌀 고추장 · 조선간장",
      region: "경남 합천 · 함양", tagline: "3년 자연 숙성 옹기 장류",
      description: "국내산 토종 콩과 천일염으로 빚어 햇살 아래 3년 이상 익힌 깊은 감칠맛의 전통 장류 3종 세트입니다. 명절 차례상과 주방의 품격을 더합니다.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEek5sxbUJlTAw3j8GnMtdZP4ziKEyIs1GavD476WgJLf0A6KdakGv-jROlOYo2kd-i0dhaWKqCUe_YCUTrKWVfCtNg3nFjO2i4TURU_kZPjH8o9GtLBvki7ej7Qc7BalrIpaC1tMQ5PIKXwzzgB3-UyFG_akY-RwbWAAZsejwio2U5jaa827ZXG5mmJoej6B50D7w5_6TtCCwHgS31ZIAob2lzUirbBTB5DfhCTU",
      price: 35000, originalPrice: null, badges: [],
      targets: ["parents", "bulk"], stock: 0, coldChain: false,
    }),
    p({
      id: "p-tteok", name: "[의령 전통 수제 망개떡 & 오색 찹쌀 한과 세트]",
      region: "경남 의령군", tagline: "당일 제조 급속 냉동 발송",
      description: "망개잎의 은은한 향과 부드러운 팥소의 조화가 일품인 명물 망개떡과 100% 국산 조청으로 버무린 오색 찹쌀 한과를 풍성하게 담았습니다.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBm9CeE86KwW_NN0EDc1RjmTxG5uVKtCBwk3H1eUgkED2QdN6abFP4ow7qrNUVYUaqUE1glnj5bqxiApqW23c65Fk3mesxIW4dPiVWEu86-A9XLBjp4vWAegMraDoZ13pEPyevJJTX1mPexO6fSGSsXGCT5a3VyfNAvSYD6Yg1F2gdhItskP_0jpR0gQBlbHzoqsRTrfuZeVYdpVkij3wmYpGof0pvRpSqV2xZsh9Q",
      price: 38000, originalPrice: null, badges: [],
      targets: ["parents", "bulk", "health"], stock: 60, coldChain: true,
    }),
  ];

  const byId = Object.fromEntries(products.map((x) => [x.id, x]));
  const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();
  let seq = 0;
  const o = (
    x: Omit<Order, "id" | "total" | "items" | "trackingNumber" | "memo" | "isSample"> & {
      items: [string, number][];
      trackingNumber?: string;
    },
  ): Order => {
    const items = x.items.map(([id, quantity]) => ({
      productId: id,
      name: byId[id].name,
      price: byId[id].price,
      quantity,
    }));
    seq += 1;
    return {
      ...x,
      id: `ORD-${todayKst().replaceAll("-", "")}-${String(seq).padStart(3, "0")}`,
      items,
      total: items.reduce((s, i) => s + i.price * i.quantity, 0),
      trackingNumber: x.trackingNumber ?? "",
      memo: "",
      isSample: true,
    };
  };

  const orders: Order[] = [
    o({ createdAt: hoursAgo(1), customer: { name: "김민서", phone: "010-2345-6789", email: "minseo@example.com" },
      recipient: { name: "김영자", phone: "010-1111-2222", address: "경남 창원시 성산구 중앙대로 100" },
      items: [["p-gn4", 1]], deliveryDate: todayKst(3), wrapping: "bojagi", giftMessage: "어머니, 늘 건강하세요.", status: "paid" }),
    o({ createdAt: hoursAgo(3), customer: { name: "(주)한빛물산", phone: "055-123-4567", email: "hr@hanbit.example.com" },
      recipient: { name: "인사팀 박과장", phone: "055-123-4567", address: "경남 김해시 김해대로 2400 한빛빌딩 3층" },
      items: [["p-anchovy", 30], ["p-jang", 11]], deliveryDate: todayKst(5), wrapping: "basic", giftMessage: "", status: "paid" }),
    o({ createdAt: hoursAgo(6), customer: { name: "이준호", phone: "010-3456-7890", email: "junho@example.com" },
      recipient: { name: "이순례", phone: "010-3333-4444", address: "부산 해운대구 센텀중앙로 55" },
      items: [["p-persimmon", 2]], deliveryDate: todayKst(3), wrapping: "bojagi", giftMessage: "할머니 사랑해요", status: "preparing" }),
    o({ createdAt: hoursAgo(20), customer: { name: "최유진", phone: "010-4567-8901", email: "yujin@example.com" },
      recipient: { name: "최유진", phone: "010-4567-8901", address: "서울 강남구 테헤란로 152" },
      items: [["p-tea", 1], ["p-tteok", 1]], deliveryDate: todayKst(2), wrapping: "bojagi", giftMessage: "", status: "preparing" }),
    o({ createdAt: hoursAgo(30), customer: { name: "정다은", phone: "010-5678-9012", email: "daeun@example.com" },
      recipient: { name: "정상철", phone: "010-5555-6666", address: "대구 수성구 달구벌대로 2500" },
      items: [["p-gn4", 2]], deliveryDate: todayKst(1), wrapping: "bojagi", giftMessage: "아버님 명절 잘 보내세요", status: "shipping", trackingNumber: "6896-1234-5678" }),
    o({ createdAt: hoursAgo(50), customer: { name: "한성우", phone: "010-6789-0123", email: "sungwoo@example.com" },
      recipient: { name: "한성우", phone: "010-6789-0123", address: "경남 진주시 진주대로 501" },
      items: [["p-tteok", 3]], deliveryDate: todayKst(-1), wrapping: "basic", giftMessage: "", status: "delivered", trackingNumber: "6896-2222-3333" }),
    o({ createdAt: hoursAgo(55), customer: { name: "오세라", phone: "010-7890-1234", email: "sera@example.com" },
      recipient: { name: "오세라", phone: "010-7890-1234", address: "인천 연수구 컨벤시아대로 165" },
      items: [["p-jang", 1]], deliveryDate: todayKst(4), wrapping: "basic", giftMessage: "", status: "cancelled" }),
  ];

  return { products, orders };
}
