---
name: Gyeongnam Heritage Harvest
colors:
  surface: '#fbf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#fbf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#eae8e5'
  surface-container-highest: '#e4e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#45474c'
  inverse-surface: '#30312f'
  inverse-on-surface: '#f2f0ed'
  outline: '#76777d'
  outline-variant: '#c6c6cc'
  surface-tint: '#575e6f'
  primary: '#060d1a'
  on-primary: '#ffffff'
  primary-container: '#1c2331'
  on-primary-container: '#838a9c'
  inverse-primary: '#c0c6d9'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#250000'
  on-tertiary: '#ffffff'
  tertiary-container: '#4f0001'
  on-tertiary-container: '#e65e4e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce2f6'
  primary-fixed-dim: '#c0c6d9'
  on-primary-fixed: '#151c29'
  on-primary-fixed-variant: '#404756'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4a9'
  on-tertiary-fixed: '#410000'
  on-tertiary-fixed-variant: '#8a1b13'
  background: '#fbf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2df'
typography:
  headline-xl:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Noto Serif
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 21px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 19px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Source Sans 3
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Source Sans 3
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  label-md:
    fontFamily: Source Sans 3
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Source Sans 3
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses "전통의 품격과 고향의 따뜻함" (Traditional Elegance & Hometown Warmth) tailored specifically for mobile web experiences catering to gift buyers aged 40–60 and corporate/bulk order clients. 

The aesthetic marries **Refined Heritage Minimal** with subtle tactile metaphors inspired by artisanal Korean paper (Hanji) and bojagi gift wrappings. It avoids loud modern gimmicks in favor of:
- **Serene Authority:** Deep charcoal ink and antique brass-gold instill absolute trust and provenance for agricultural and artisanal goods.
- **Generous Tactility:** Gentle parchment backgrounds, delicate frame borders resembling traditional wooden lattice screens (살창), and quiet gift ribbon accents.
- **High Readability & Respectful Navigation:** Clean layouts, accessible tap targets (minimum 48px), high contrast text ratios, and distinct bulk-order purchase flows.

## Colors

The palette is rooted in classical ink, natural mulberry paper, and celebratory gift accents:

- **Primary (`#1C2331` - Navy Ink / 먹묵색):** Anchors the brand with institutional gravity, heritage authority, and crisp readability for typography and high-priority actions.
- **Secondary (`#C5A059` - Earth Gold / 황동금박):** Evokes the understated glow of gold-leaf seals, brass craft, and premium grade verification.
- **Tertiary / Accent (`#A93226` - Dancheong Crimson / 단청 주홍):** Reserved strictly for promotional badge highlights, corporate holiday gift tags, price discounts, and essential celebratory CTAs.
- **Neutral Canvas (`#FAF8F5` - Hanji Warm White / 백모시미색):** Soft off-white base that eliminates harsh screen glare for mature eyes, paired with pure white (`#FFFFFF`) card containers and antique border tones (`#E8DFD0`).

## Typography

The dual-type hierarchy serves emotional provenance and crystalline clarity:

- **Headlines (`Noto Serif`):** Delivers the literary prestige and cultural gravity of traditional Korean wooden type printing. Used for collection titles, regional origin indicators (e.g., 통영 굴, 하동 녹차, 밀양 사과), and editorial gift curations.
- **Body & Controls (`Source Sans 3`):** High x-height sans-serif engineered for maximum legibility on mobile screens, especially for ages 40–60. Line heights are deliberately expanded (1.6–1.65×) to reduce eye fatigue.
- Minimum size for critical transactional and pricing text is kept at `14px` (`label-md` or `body-md`), with supporting legal/delivery notes never dropping below `12px`.

## Layout & Spacing

A fluid mobile-first grid prioritizing ease of browsing, uncluttered product showcases, and generous thumb-reach zones:

- **Canvas & Gutters:** Mobile layouts use a 4-column structure with `margin-mobile: 1rem` and `gutter-mobile: 0.75rem`. On larger viewports (tablets/desktops used for corporate procurement), the grid scales into an 8 or 12-column layout with `gutter: 1rem` and max container width of `1120px`.
- **Rhythm:** Generous vertical spacing (`space-xl: 2.5rem`) separates curation collections (e.g., "명절 대량 선물세트", "산지 직송 명품전") to replicate the calm pacing of a traditional handicraft gallery.
- **Touch Ergonomics:** Interactive targets (selectors, quantity steppers, cart buttons) feature a minimum height of 48px to prevent accidental taps.

## Elevation & Depth

Rather than synthetic multi-directional drop shadows, this design system establishes hierarchy through tonal layering, paper framing, and subtle brass borders:

- **Level 0 (Base Canvas):** `#FAF8F5` textured paper tone representing raw Hanji.
- **Level 1 (Surface Cards & Items):** `#FFFFFF` cards framed by a 1px crisp outline in `#E8DFD0`. No blurry shadows; instead, edge crispness provides tactile paper card qualities.
- **Level 2 (Popovers & Filter Sheets):** `#FFFFFF` surface lifted with an ambient warm shadow: `0 8px 24px rgba(28, 35, 49, 0.08)`.
- **Level 3 (Fixed Sticky Bars & Quick Cart):** Raised bottom navigation bar with a subtle top border (`1px solid #E8DFD0`) and diffuse upward glow: `0 -4px 16px rgba(28, 35, 49, 0.05)`.
- **Framed Accents (Bojagi Edge):** Featured gift packages use a double-border effect (1px solid `#E8DFD0` with an inner 2px inset gap and 1px line in `#C5A059`) evoking traditional wooden screen frames.

## Shapes

The design uses soft, dignified corners (`roundedness: 1` = 0.25rem / 4px base). 

- Cards, inputs, and standard buttons employ subtle `4px` corner radii, reminiscent of pressed calligraphy paper and traditional wooden gift chests rather than hyper-rounded consumer apps.
- Product badges and official authentication tags maintain sharp, tailored geometry (`2px` to `4px`).
- Circular treatments are strictly reserved for quantity steppers, profile badges, and seal stamps (인장).

## Components

### Buttons
- **Primary Action (Immediate Purchase / Gift Send):** Background `#1C2331`, text `#FAF8F5`, height 50px, border-radius 4px. Bold typography (`label-lg`).
- **Bulk Order / Corporate Inquiry (단체/기업 주문):** Background `#FAF8F5`, border `1.5px solid #C5A059`, text `#1C2331`. Features an icon of a tied bojagi or formal envelope.
- **Accent Action:** Background `#A93226` for urgent pre-orders or limited seasonal releases.

### Cards & Product Frames
- Standard item card sits on `#FFFFFF` with a `1px solid #E8DFD0` border.
- Includes clear origin tags (e.g., [경남 하동], [경남 산청]) styled as small framed badges (`#FAF8F5` background, `#2A3447` text).
- Bulk gift package cards feature a delicate brass inner border and an explicit "대량할인 견적서 출력 가능" (Bulk discount / estimate available) indicator.

### Chips & Filters
- Inactive state: `#FFFFFF` background, `1px solid #E8DFD0`, text `#1C2331`.
- Active state: `#1C2331` background, text `#FAF8F5`, border `1px solid #1C2331`. Generous padding (`space-xs` vertical, `space-md` horizontal) for thumb tap accuracy.

### Lists & Form Inputs
- **Inputs:** Height 50px, `#FFFFFF` background, `1px solid #E8DFD0` resting state, shifting to `1.5px solid #1C2331` upon focus. Placeholder text in `#8C827A`.
- **Bulk Quantity Steppers:** Prominent numeric counters with dedicated `+` and `-` boxes (minimum 44x44px touch targets).

### Checkboxes & Radios
- Square 22x22px frames with 2px radius. When checked, filled with `#1C2331` and a crisp white tick mark, avoiding neon blues.

### Heritage Gift Ribbon / Packaging Options
- Dedicated component allowing users to choose traditional gift packaging: 보자기 (Silk Bojagi), 오동나무 상자 (Paulownia Wood Box), or 친환경 한지 포장 (Eco Hanji Wrap) with visual preview swatches and gift card message preview.