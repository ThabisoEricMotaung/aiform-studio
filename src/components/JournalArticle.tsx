import Image from "next/image";
import type { JournalBlock, JournalEntry } from "@/content/journal";

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
  const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: entry.title, description: entry.excerpt, datePublished: entry.publishedAt, dateModified: entry.updatedAt ?? entry.publishedAt, author: { "@type": "Person", name: entry.author }, image: entry.heroImage?.src };
  return <article className="editorial-grid py-20 md:py-28"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><header className="col-span-12 md:col-start-3 md:col-span-8"><p className="chapter-label">{entry.category} / {entry.publishedAt}</p><h1 className="mt-8 font-display text-5xl leading-[.98] md:text-7xl">{entry.title}</h1><p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted">{entry.excerpt}</p><p className="mt-7 text-xs text-muted">{entry.author} · {entry.readingTime}{entry.updatedAt ? ` · Updated ${entry.updatedAt}` : ""}</p></header>{entry.heroImage ? <figure className="col-span-12 mt-14 md:col-start-2 md:col-span-10"><Image src={entry.heroImage.src} alt={entry.heroImage.alt} width={1600} height={1000} sizes="100vw" className="h-auto w-full" />{entry.heroImage.attribution ? <figcaption className="mt-3 text-xs text-muted">{entry.heroImage.attribution}</figcaption> : null}</figure> : null}<div className="col-span-12 mt-16 md:col-start-4 md:col-span-6">{entry.body.map((block, index) => <Block key={`${block.type}-${index}`} block={block} />)}</div></article>;
}
