import Image from "next/image";
import Link from "next/link";
import type { JournalBlock, JournalEntry } from "@/content/journal";
import { getAdjacentSeriesEntries, getRelatedEntries } from "@/content/journal";
import styles from "@/app/journal/journal.module.css";

function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

// The upper eyebrow: series identity (e.g. "Procurement Notes / 03 / Building
// AiForm Procure") for series entries, or just the category otherwise. Date
// and reading time live only in the byline below, never here, so neither
// value is ever shown twice in the header.
function eyebrowLabel(entry: JournalEntry) {
  if (entry.series) {
    return [entry.series.name, String(entry.series.number).padStart(2, "0"), entry.series.context].filter(Boolean).join(" / ");
  }
  return entry.category;
}

function Block({ block }: { block: JournalBlock }) {
  switch (block.type) {
    case "heading": {
      const Heading = block.level === 2 ? "h2" : "h3";
      return <Heading className={block.level === 2 ? "mt-16 font-display text-3xl md:text-4xl" : "mt-12 font-display text-2xl md:text-3xl"}>{block.text}</Heading>;
    }
    case "paragraph": return <p className="mt-6 text-lg leading-8 text-text/85">{block.text}</p>;
    case "quote": return <blockquote className="my-12 border-l-2 border-gold pl-7 text-xl leading-relaxed text-green"><p>{block.text}</p>{block.attribution ? <cite className="mt-4 block text-sm not-italic text-muted">{block.attribution}</cite> : null}</blockquote>;
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return <List className={`my-7 space-y-3 pl-6 text-lg leading-8 ${block.ordered ? "list-decimal" : "list-disc"}`}>{block.items.map((item) => <li key={item}>{item}</li>)}</List>;
    }
    case "table": return <div className="my-10 overflow-x-auto"><table className="w-full border-collapse text-left text-sm"><thead><tr>{block.headers.map((header) => <th key={header} className="border-b border-text px-3 py-3 font-semibold">{header}</th>)}</tr></thead><tbody>{block.rows.map((row) => <tr key={row.join("|")}>{row.map((cell, index) => <td key={`${cell}-${index}`} className="border-b border-line px-3 py-3 align-top">{cell}</td>)}</tr>)}</tbody></table></div>;
    case "figure": return <figure className="my-12"><Image src={block.src} alt={block.alt} width={1400} height={900} sizes="(max-width: 768px) 100vw, 800px" className="h-auto w-full" /><figcaption className="mt-3 text-xs leading-relaxed text-muted">{block.caption}{block.attribution ? ` · ${block.attribution}` : ""}</figcaption></figure>;
    case "callout": return <aside className="my-10 border-y border-line py-7"><p className="chapter-label">{block.title ?? "Field note"}</p><p className="mt-3 leading-7">{block.text}</p></aside>;
    case "references": return <section className="mt-16 border-t border-line pt-7"><h2 className="font-display text-2xl">Sources &amp; further reading</h2><ol className="mt-5 space-y-3 text-sm text-muted">{block.items.map((item) => <li key={item.href}><a href={item.href} rel="noreferrer" target="_blank" className="underline decoration-line underline-offset-4 hover:text-green">{item.label}</a></li>)}</ol></section>;
    case "footnotes": return <section className="mt-12 border-t border-line pt-6"><h2 className="chapter-label">Footnotes</h2><ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-6 text-muted">{block.items.map((item) => <li key={item}>{item}</li>)}</ol></section>;
  }
}

export default function JournalArticle({ entry }: { entry: JournalEntry }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.excerpt,
    datePublished: entry.publishedAt,
    dateModified: entry.updatedAt ?? entry.publishedAt,
    author: { "@type": "Person", name: entry.author },
    image: entry.heroImage?.src,
    ...(entry.series ? { isPartOf: { "@type": "CreativeWorkSeries", name: entry.series.name }, position: entry.series.number } : {}),
  };
  const { previous, next } = getAdjacentSeriesEntries(entry);
  const related = getRelatedEntries(entry);

  return <article className={`${styles.articlePage} editorial-grid`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <div className={`${styles.folio} ${styles.articleFolio}`}><Link href="/journal" className={styles.articleBack}>← The Journal</Link><span>AiForm Studio / {entry.category}</span></div>
    <header className={`col-span-12 md:col-start-3 md:col-span-8 ${styles.articleHeader}`}>
      <p className={styles.articleSeriesLine}>{eyebrowLabel(entry)}</p>
      <h1 className={styles.articleTitle}>{entry.title}</h1>
      <p className={styles.articleDek}>{entry.subtitle ?? entry.excerpt}</p>
      <p className={styles.articleByline}>By {entry.author} · {formatArticleDate(entry.publishedAt)} · {entry.readingTime}{entry.updatedAt ? ` · Updated ${formatArticleDate(entry.updatedAt)}` : ""}</p>
    </header>
    {entry.heroImage ? <figure className="col-span-12 mt-14 md:col-start-2 md:col-span-10"><Image src={entry.heroImage.src} alt={entry.heroImage.alt} width={entry.heroImage.width ?? 1600} height={entry.heroImage.height ?? 1000} sizes="100vw" className="h-auto w-full" />{entry.heroImage.attribution ? <figcaption className="mt-3 text-xs text-muted">{entry.heroImage.attribution}</figcaption> : null}</figure> : null}
    <div className={`col-span-12 md:col-start-4 md:col-span-6 ${styles.articleBody}`}>
      {entry.body.map((block, index) => <Block key={`${block.type}-${index}`} block={block} />)}

      {entry.relatedProject ? (
        <section className={styles.builtFrom} aria-labelledby="built-from-title">
          <p id="built-from-title">Built from this thinking</p>
          <p className={styles.builtFromName}>{entry.relatedProject.name}</p>
          <p className={styles.builtFromCopy}>{entry.relatedProject.description}</p>
          <Link href={entry.relatedProject.href} className={styles.builtFromLink}>View the {entry.relatedProject.name} case study <span aria-hidden="true">→</span></Link>
        </section>
      ) : null}

      {related.length ? (
        <section className={styles.relatedThinking} aria-labelledby="related-thinking-title">
          <p id="related-thinking-title">Related thinking</p>
          {related.map((piece) => (
            <Link key={piece.slug} href={`/journal/${piece.slug}`} className={styles.relatedRow}>
              <span className={styles.relatedRowMeta}>{piece.series ? `${piece.series.name} / ${String(piece.series.number).padStart(2, "0")}` : piece.category}</span>
              <h4>{piece.title}</h4>
            </Link>
          ))}
        </section>
      ) : null}

      {entry.series && (previous || next) ? (
        <nav className={styles.seriesNav} aria-label="Procurement Notes series navigation">
          {previous ? (
            <Link href={`/journal/${previous.slug}`} className={styles.seriesNavItem}>
              <span className={styles.seriesNavDirection}>← Previous</span>
              <p className={styles.seriesNavTitle}>{previous.title}</p>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/journal/${next.slug}`} className={styles.seriesNavItem}>
              <span className={styles.seriesNavDirection}>Next →</span>
              <p className={styles.seriesNavTitle}>{next.title}</p>
            </Link>
          ) : <span />}
        </nav>
      ) : null}

      {entry.series ? <Link href="/journal#procurement-notes" className={styles.seriesViewAll}>View all {entry.series.name} <span aria-hidden="true">→</span></Link> : null}

      <div className="mt-16 border-t border-line pt-6"><Link href="/journal" className={styles.articleBack}>← All Journal stories</Link></div>
    </div>
  </article>;
}
