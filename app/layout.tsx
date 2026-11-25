/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "경남명품향토몰",
  other: { "shell-type": "mobile_tab" },
  verification: {
    google: "PdQTpakB40UR8lEAm128HtEjjd-IgI2vfLaO7HC59n0",
    other: { "naver-site-verification": "e364dcc07c4135df28bdd7671d3ea01519fff246" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@100..900&family=Source+Sans+3:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface flex flex-col min-h-screen selection:bg-secondary-container selection:text-on-secondary-container">
        {children}
      </body>
    </html>
  );
}
