import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8900";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "🎓 Thiệp Mời Tốt Nghiệp - Vân Anh",
  description: "Trân trọng kính mời bạn đến tham dự lễ tốt nghiệp cử nhân của Vân Anh.",
  keywords: "thiệp mời, tốt nghiệp, Vân Anh, lễ tốt nghiệp, Học viện Quản lý Giáo dục",
  openGraph: {
    title: "🎓 Thiệp Mời Tốt Nghiệp - Vân Anh",
    description: "Trân trọng kính mời bạn đến tham dự lễ tốt nghiệp cử nhân của Vân Anh.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
