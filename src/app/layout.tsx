import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppProvider";
import GlobalShell from "@/components/GlobalShell";
import OneSignalInit from "@/components/OneSignalInit";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cứu Trợ Cận Date",
  description: "Nền tảng kết nối cửa hàng và người tiêu dùng để giải cứu thực phẩm sắp hết hạn, giảm lãng phí, tiết kiệm chi tiêu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans bg-surface text-on_surface antialiased`}>
        <Providers>
          <AppProvider>
            <OneSignalInit />
            <Suspense fallback={null}>
              <GlobalShell>
                {children}
              </GlobalShell>
            </Suspense>
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}
