import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { invitation } from "@/content/invitation";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!siteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required.");
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: invitation.site.title,
  description: invitation.site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    title: invitation.site.title,
    description: invitation.site.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={`${geist.variable} antialiased`}>{children}</body>
    </html>
  );
}
