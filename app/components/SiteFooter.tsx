export default function SiteFooter() {
  return (
    <footer className="mt-space-xl bg-surface-container-low px-margin-mobile py-space-xl text-on-surface-variant">
      <div className="flex flex-wrap items-center gap-x-space-md gap-y-space-xs font-label-sm text-label-sm mb-space-md">
        <a className="font-bold text-on-surface hover:underline" href="#">
          개인정보처리방침
        </a>
        <span className="text-outline-variant">|</span>
        <a className="hover:underline" href="#">
          이용약관
        </a>
        <span className="text-outline-variant">|</span>
        <a className="hover:underline" data-path="cs-bulk-orders" href="#">
          고객센터
        </a>
        <span className="text-outline-variant">|</span>
        <a className="hover:underline" href="#">
          에스크로 안전결제 안내
        </a>
      </div>
      <div className="font-body-sm text-body-sm leading-relaxed space-y-1 text-on-surface-variant/80">
        <p>
          <strong className="text-on-surface font-semibold">경남명품향토몰</strong> | 대표자: 홍길동
        </p>
        <p>사업자등록번호: 612-81-XXXXX | 통신판매업 신고번호: 제 2024-경남창원-0000호</p>
        <p>주소: 경상남도 창원시 의창구 중앙대로 300 경남도청 특산물유통센터</p>
        <p>
          고객센터: <span className="text-on-surface font-bold text-label-md">1588-7240</span> (평일
          09:00~18:00, 주말·공휴일 휴무)
        </p>
        <p>단체·대량주문 직통: 055-123-4567 | 이메일: support@gn-specialty.kr</p>
      </div>
      <div className="mt-space-md pt-space-md font-label-sm text-label-sm text-outline">
        <p>© Gyeongnam Specialty Craft &amp; Food Mall. All rights reserved.</p>
      </div>
    </footer>
  );
}
