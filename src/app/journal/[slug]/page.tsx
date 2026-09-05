import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JournalArticle from "@/components/JournalArticle";
import { getPublishedEntries, getPublishedEntry } from "@/content/journal";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedEntries().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getPublishedEntry(slug);
  if (!entry) return {};
  const url = `https://aiformstudio.co.za/journal/${entry.slug}`;
  const images = entry.heroImage
    ? [{ url: entry.heroImage.src, alt: entry.heroImage.alt }]
    : [{ url: "/images/aiform-story.png", width: 1254, height: 1254, alt: "AiForm Studio logo and its moth-inspired design origins" }];
  return {
    title: entry.seoTitle,
    description: entry.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article", url, siteName: "AiForm Studio", locale: "en_ZA",
      title: entry.seoTitle, description: entry.seoDescription,
      publishedTime: entry.publishedAt, modifiedTime: entry.updatedAt,
      authors: [entry.author], images,
    },
    twitter: { card: "summary", title: entry.seoTitle, description: entry.seoDescription, images },
  };
}

export default async function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const entry = getPublishedEntry(slug);
  if (!entry) notFound();
  return <JournalArticle entry={entry} />;
}
