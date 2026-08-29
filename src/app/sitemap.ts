import type { MetadataRoute } from "next";
import { getPublishedEntries } from "@/content/journal";
const base = "https://aiformstudio.co.za";
export default function sitemap(): MetadataRoute.Sitemap { const routes = ["", "/work", "/work/aiform-procure", "/work/wanotuts", "/contact", "/journal", "/privacy"]; return [...routes.map((route) => ({ url: `${base}${route}`, changeFrequency: route === "" ? "monthly" as const : "yearly" as const, priority: route === "" ? 1 : 0.7 })), ...getPublishedEntries().map((entry) => ({ url: `${base}/journal/${entry.slug}`, lastModified: entry.updatedAt || entry.publishedAt, changeFrequency: "monthly" as const, priority: 0.6 }))]; }
