import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedEntries } from "@/content/journal";
import styles from "./journal.module.css";

const journalDescription = "Reporting, analysis and field notes on procurement, technology and the systems shaping everyday work.";

function displayDate(value: string) {
  return new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export const metadata: Metadata = {
  title: "Journal",
  description: journalDescription,
  alternates: { canonical: "/journal" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://aiformstudio.co.za/journal",
    siteName: "AiForm Studio",
    title: "Journal | AiForm Studio",
    description: journalDescription,
    images: [{ url: "https://aiformstudio.co.za/images/aiform-story.png", width: 1254, height: 1254, alt: "AiForm Studio logo and its moth-inspired design origins" }],
  },
  twitter: {
    card: "summary",
    title: "Journal | AiForm Studio",
    description: journalDescription,
    images: ["https://aiformstudio.co.za/images/aiform-story.png"],
  },
};

export default function JournalPage() {
  const [lead, ...archive] = [...getPublishedEntries()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return <>
    <section className={styles.masthead} aria-labelledby="journal-title">
      <div className="editorial-grid">
        <div className={`col-span-12 ${styles.folio}`}>
          <span>AiForm Studio</span>
          <span>Journal / Pretoria, South Africa</span>
        </div>
        <div className={`col-span-12 ${styles.mastheadBody}`}>
          <p className={styles.overline}>Ideas, examined in public</p>
          <h1 id="journal-title" className={styles.mastheadTitle}>The Journal<span>.</span></h1>
          <p className={styles.dek}>{journalDescription}</p>
        </div>
      </div>
    </section>

    <section className={styles.stories} aria-labelledby="latest-title">
      <div className="editorial-grid">
        <div className={`col-span-12 ${styles.sectionRule}`}>
          <h2 id="latest-title">Latest story</h2>
          <span>{lead ? displayDate(lead.publishedAt) : "From the Journal"}</span>
        </div>
        {lead ? <>
          <article className={`col-span-12 lg:col-span-8 ${styles.leadStory}`}>
            <p className={styles.storyMeta}>{lead.category} <span aria-hidden="true">/</span> {lead.readingTime}</p>
            <h3 className={styles.leadTitle}><Link href={`/journal/${lead.slug}`}>{lead.title}</Link></h3>
            <p className={styles.leadExcerpt}>{lead.excerpt}</p>
            <Link href={`/journal/${lead.slug}`} className={styles.readLink} aria-label={`Read ${lead.title}`}>Read the story <span aria-hidden="true">↗</span></Link>
          </article>
          <aside className={`col-span-12 lg:col-span-4 ${styles.contextRail}`} aria-label="About the Journal">
            <p className={styles.railLabel}>The editorial lens</p>
            <p className={styles.railStatement}>What changed? What does the evidence say? What should we do differently?</p>
            <p className={styles.railCopy}>We follow public developments and practical questions behind the systems AiForm builds.</p>
            <div className={styles.railConnection}>
              <p className={styles.railLabel}>Connected work</p>
              <Link href="/work/aiform-procure">AiForm Procure <span aria-hidden="true">↗</span></Link>
            </div>
          </aside>
        </> : <p className={`col-span-12 ${styles.emptyState}`}>The first story is in progress.</p>}
      </div>
    </section>

    {archive.length ? <section className={styles.archive} aria-labelledby="archive-title"><div className="editorial-grid">
      <div className={`col-span-12 ${styles.sectionRule}`}><h2 id="archive-title">More from the Journal</h2></div>
      <div className="col-span-12">{archive.map((entry) => <article key={entry.slug} className={styles.archiveRow}>
        <p className={styles.storyMeta}>{entry.category}<span className={styles.archiveDate}>{displayDate(entry.publishedAt)}</span></p>
        <h3><Link href={`/journal/${entry.slug}`}>{entry.title}</Link></h3>
        <p>{entry.excerpt}</p>
      </article>)}</div>
    </div></section> : null}
  </>;
}
