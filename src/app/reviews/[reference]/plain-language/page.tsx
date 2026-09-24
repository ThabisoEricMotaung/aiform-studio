import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlainLanguageProductReview } from "@/lib/plain-language-product-review";
import { formatDate, humanize } from "@/lib/studio-review-format";
import ReviewViewSwitch from "../ReviewViewSwitch";
import styles from "../report.module.css";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ reference: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getPlainLanguageProductReview((await params).reference);
  if (!result) notFound();
  const title = `${result.review.reference} | Plain-language Review | AiForm Studio`;
  const description = "The issued Product Review explained in everyday language.";
  return { title: { absolute: title }, description, robots: { index: false, follow: false, noarchive: true },
    alternates: { canonical: null }, openGraph: { title, description, images: [], url: `/reviews/${result.review.reference}/plain-language` },
    twitter: { card: "summary", title, description, images: [] } };
}

export default async function PlainLanguageReviewPage({ params }: Props) {
  const result = await getPlainLanguageProductReview((await params).reference);
  if (!result) notFound();
  const { review, copy } = result;
  return <article className={styles.report} aria-labelledby="report-title"><div className={styles.sheet}>
    <header className={styles.masthead}><span>AiForm <strong>Studio</strong></span><span>Product Review</span></header>
    <ReviewViewSwitch reference={review.reference} current="plain" />
    <header className={styles.opening}>
      <p className={styles.kicker}>Product Review <span>{review.reference}</span></p>
      <h1 id="report-title">{review.product}</h1><p className={styles.client}>{review.client}</p>
      <p className={styles.plainIntro}>This version explains the review in everyday language. It covers the same findings as the detailed review, without requiring product or technical terminology.</p>
      <p className={styles.verification}>The detailed review contains the formal findings and evidence behind this version.</p>
      <dl className={styles.metadata}>
        <div><dt>Report</dt><dd>{humanize(review.status)} &middot; Version {review.version}</dd></div>
        {review.date && <div><dt>Review date</dt><dd>{formatDate(review.date)}</dd></div>}
        <div><dt>View</dt><dd>Plain-language review</dd></div>
      </dl>
      <div className={styles.question}><h2>The question behind this review</h2><p>{review.question}</p></div>
    </header>
    <section className={styles.section} aria-labelledby="takeaway">
      <h2 id="takeaway" className={styles.sectionHeading}><span>01</span> The main takeaway</h2>
      <div className={styles.recommendation}><p className={styles.prose}>{copy.takeaway}</p></div>
    </section>
    <section className={styles.section} aria-labelledby="working">
      <h2 id="working" className={styles.sectionHeading}><span>02</span> What is already working</h2>
      <ul className={styles.plainList}>{copy.working.map(text => <li key={text}>{text}</li>)}</ul>
      <div className={styles.plainPreserve}><h3>What to leave alone</h3><p className={styles.prose}>{copy.preserve}</p></div>
    </section>
    <section className={styles.section} aria-labelledby="coverage">
      <h2 id="coverage" className={styles.sectionHeading}><span>03</span> What we looked at</h2>
      <p className={styles.prose}>{copy.scope}</p>
      <ul className={styles.coverage}>{copy.coverage.map(text => <li key={text}>{text}</li>)}</ul>
    </section>
    <section className={styles.section} aria-labelledby="findings">
      <h2 id="findings" className={styles.sectionHeading}><span>04</span> What we found</h2>
      {copy.findings.map(finding => <section key={finding.reference} className={styles.finding} aria-labelledby={finding.reference}>
        <header className={styles.findingHeader}>
          <p className={styles.plainReference}>{finding.reference}</p><h3 id={finding.reference}>{finding.title}</h3>
          <p className={styles.plainPriority}>{finding.priority}</p>
        </header>
        <div className={styles.findingBody}>
          <section><h4>What we found</h4><p className={styles.prose}>{finding.found}</p></section>
          <section><h4>Why it matters</h4><p className={styles.prose}>{finding.matters}</p></section>
          <section className={styles.findingRecommendation}><h4>What to do</h4><p className={styles.prose}>{finding.action}</p></section>
          <section><h4>What we know</h4><p className={styles.prose}>{finding.known}</p></section>
        </div>
      </section>)}
    </section>
    <section className={styles.section} aria-labelledby="checking">
      <h2 id="checking" className={styles.sectionHeading}><span>05</span> Things worth checking</h2>
      <ul className={styles.assumptions}>{copy.assumptions.map(item => <li key={item.reference}>
        <span className={styles.assumptionRef}>{item.reference}</span><div><p className={styles.prose}>{item.text}</p><p className={styles.verification}>{item.known}</p></div>
      </li>)}</ul>
    </section>
    <section className={styles.section} aria-labelledby="limitations">
      <h2 id="limitations" className={styles.sectionHeading}><span>06</span> What we did not test</h2>
      <ul className={styles.plainList}>{copy.limitations.map(text => <li key={text}>{text}</li>)}</ul>
    </section>
    <footer className={styles.footer}><span>AiForm Studio &middot; Plain-language review</span><span>{review.reference} &middot; Version {review.version}</span></footer>
  </div></article>;
}
