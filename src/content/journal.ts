export type JournalCategory = "Procurement" | "Research" | "Technology" | "Building" | "Observations";

export type JournalBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "figure"; src: string; alt: string; caption?: string; attribution?: string }
  | { type: "callout"; title?: string; text: string }
  | { type: "references"; items: { label: string; href: string }[] }
  | { type: "footnotes"; items: string[] };

export type JournalEntry = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: JournalCategory;
  tags: string[];
  heroImage?: { src: string; alt: string; attribution?: string };
  readingTime: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published";
  body: JournalBlock[];
};

// Issue 00 has no published entries. Add future local articles here; a CMS can
// later supply the same shape without changing the Journal presentation.
export const journalEntries: JournalEntry[] = [];

export function getPublishedEntries() {
  return journalEntries.filter((entry) => entry.status === "published");
}

export function getPublishedEntry(slug: string) {
  return getPublishedEntries().find((entry) => entry.slug === slug);
}
