import type { MetadataRoute } from "next";
import { getPublishedEntries } from "@/content/journal";

const base = "https://aiformstudio.co.za";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      url: `${base}/work`,
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: `${base}/work/aiform-procure`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    },
    {
      url: `${base}/work/wanotuts`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    },
    {
      url: `${base}/contact`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${base}/journal`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${base}/privacy`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  const journalRoutes: MetadataRoute.Sitemap = getPublishedEntries().map((entry) => ({
    url: `${base}/journal/${entry.slug}`,
    lastModified: entry.updatedAt || entry.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...journalRoutes];
}
