import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is required.");
  }

  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-07-17T00:00:00+07:00"),
      changeFrequency: "yearly",
      priority: 1,
    },
  ];
}
