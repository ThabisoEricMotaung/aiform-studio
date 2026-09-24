import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProductReview } from "@/lib/public-product-review";
import { formatDate, humanize } from "@/lib/studio-review-format";
import styles from "./report.module.css";
import ReviewViewSwitch from "./ReviewViewSwitch";
import { getPlainLanguageProductReview } from "@/lib/plain-language-product-review";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ reference: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const review = await getPublicProductReview((await params).reference);
  if (!review) notFound();
  return {
    title: { absolute: `${review.reference} | Product Review | AiForm Studio` },
    description: "An issued AiForm Studio Product Review.",
    robots: { index: false, follow: false, noarchive: true },
    alternates: { canonical: null },
    openGraph: { title: `${review.reference} | Product Review`, description: "An issued AiForm Studio Product Review.", images: [], url: `/reviews/${review.reference}` },
    twitter: { card: "summary", title: `${review.reference} | Product Review`, description: "An issued AiForm Studio Product Review.", images: [] },
  };
}

export default async function ProductReviewPage({ params }: Props) {
  const review = await getPublicProductReview((await params).reference);
  if (!review) notFound();
  const plainLanguage = await getPlainLanguageProductReview(review.reference);
  return <article className={styles.report} aria-labelledby="report-title">
    <div className={styles.sheet}>
      <header className={styles.masthead}><span>AiForm <strong>Studio</strong></span><span>Product Review</span></header>
      {plainLanguage && <ReviewViewSwitch reference={review.reference} current="detailed" />}
      <header className={styles.opening}>
        <p className={styles.kicker}>Product Review <span>{review.reference}</span></p>
        <h1 id="report-title">{review.product}</h1>
        <p className={styles.client}>{review.client}</p>
        <dl className={styles.metadata}>
          <div><dt>Report</dt><dd>{humanize(review.status)} &middot; Version {review.version}</dd></div>
          {review.date && <div><dt>Review date</dt><dd>{formatDate(review.date)}</dd></div>}
          <div><dt>Environment</dt><dd>{review.environment}</dd></div>
        </dl>
        <div className={styles.question}><h2>The review question</h2><p>{review.question}</p></div>
        <div className={styles.scope}><h2>Scope</h2><p>{review.scope}</p></div>
      </header>

      {review.direction.length > 0 && <section className={styles.section} aria-labelledby="direction">
        <h2 id="direction" className={styles.sectionHeading}><span>01</span> Review direction</h2>
        <div className={styles.directionGrid}>{review.direction.map(item => <section key={item.title}
          className={item.title === "Recommended direction" ? styles.recommendation : styles.context}>
          <h3>{item.title}</h3><p className={styles.prose}>{item.body}</p>
        </section>)}</div>
      </section>}

      <section className={styles.section} aria-labelledby="coverage">
        <h2 id="coverage" className={styles.sectionHeading}><span>02</span> Review coverage</h2>
        <ul className={styles.coverage}>{review.journeys.map(name => <li key={name}>{name}</li>)}</ul>
      </section>

      <section className={styles.section} aria-labelledby="findings">
        <h2 id="findings" className={styles.sectionHeading}><span>03</span> Findings</h2>
        {review.findings.map((finding, index) => <section key={index} className={styles.finding} aria-labelledby={`finding-${index}`}>
          <header className={styles.findingHeader}>
            <h3 id={`finding-${index}`}>{finding.title}</h3>
            <p className={styles.lens}>{finding.lens}</p>
            {finding.journeys.length > 0 && <ul className={styles.linkedJourneys} aria-label="Relevant journeys">{finding.journeys.map(name => <li key={name}>{name}</li>)}</ul>}
            <dl className={styles.signals}>
              <div><dt>Classification</dt><dd>{finding.classification}</dd></div>
              <div><dt>Horizon</dt><dd>{finding.horizon}</dd></div>
            </dl>
            <p className={styles.verification}>{finding.evidenceStatus} &middot; {finding.confidence.toLowerCase()} confidence</p>
          </header>
          <div className={styles.findingBody}>
            <section><h4>Observation</h4><p className={styles.prose}>{finding.observation}</p></section>
            <section><h4>Consequence</h4><p className={styles.prose}>{finding.consequence}</p></section>
            <section className={styles.findingRecommendation}><h4>Recommendation</h4><p className={styles.prose}>{finding.recommendation}</p></section>
          </div>
        </section>)}
      </section>

      <section className={styles.section} aria-labelledby="assumptions">
        <h2 id="assumptions" className={styles.sectionHeading}><span>04</span> Review assumptions</h2>
        <ul className={styles.assumptions}>{review.assumptions.map(item => <li key={item.reference}>
          <span className={styles.assumptionRef}>{item.reference}</span><div><p className={styles.prose}>{item.statement}</p>
            <p className={styles.verification}>{item.status} &middot; {item.confidence.toLowerCase()} confidence</p></div>
        </li>)}</ul>
      </section>

      {review.limitations && <section className={styles.section} aria-labelledby="limitations">
        <h2 id="limitations" className={styles.sectionHeading}><span>05</span> Review limitations</h2>
        <p className={styles.prose}>{review.limitations}</p>
      </section>}
      <footer className={styles.footer}><span>AiForm Studio &middot; Product Review</span><span>{review.reference} &middot; Version {review.version}</span></footer>
    </div>
  </article>;
}
