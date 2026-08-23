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
  return { title: entry.seoTitle, description: entry.seoDescription, alternates: { canonical: `/journal/${entry.slug}` }, openGraph: { type: "article", title: entry.seoTitle, description: entry.seoDescription, publishedTime: entry.publishedAt, modifiedTime: entry.updatedAt, authors: [entry.author], images: entry.heroImage ? [{ url: entry.heroImage.src, alt: entry.heroImage.alt }] : undefined } };
}

export default async function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const entry = getPublishedEntry(slug);
  if (!entry) notFound();
  return <JournalArticle entry={entry} />;
}
