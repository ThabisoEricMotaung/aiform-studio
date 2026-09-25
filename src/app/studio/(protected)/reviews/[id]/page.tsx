import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudioPage } from "@/lib/studio-auth";
import { getStudioReviewDetail } from "@/lib/studio-reviews";
import { formatCommercialValue, formatDate, formatDateTime, formatMinutes, humanize } from "@/lib/studio-review-format";
import { getPlainLanguageProductReview } from "@/lib/plain-language-product-review";
import { getReviewAccessState, isClientAccessEligible } from "@/lib/review-access";
import { studioAuthConfig } from "@/lib/studio-auth-config";
import ReviewAccessPanel from "@/components/studio/ReviewAccessPanel";
import styles from "../../../studio.module.css";

// Recognize only explicit, standalone labels. Unknown/ambiguous formats stay intact.
function reviewNotes(notes: string | null) {
  if (!notes) return [];
  const labels: Record<string, string> = {
    "RECOMMENDED DIRECTION": "Recommended direction",
    "POSITIVE OBSERVATIONS": "Positive observations",
    "WHAT TO LEAVE ALONE": "What to leave alone",
  };
  const matches = [...notes.matchAll(/^(RECOMMENDED DIRECTION|POSITIVE OBSERVATIONS|WHAT TO LEAVE ALONE)[ \t]*:?[ \t]*\r?$/gm)];
  if (!matches.length || new Set(matches.map(match => match[1])).size !== matches.length) {
    return [{ title: "Review notes", body: notes }];
  }
  const sections = matches.map((match, index) => ({
    title: labels[match[1]],
    body: notes.slice(match.index! + match[0].length, matches[index + 1]?.index ?? notes.length).trim(),
  }));
  if (sections.some(section => !section.body)) return [{ title: "Review notes", body: notes }];
  const preamble = notes.slice(0, matches[0].index).trim();
  if (preamble) sections.unshift({ title: "Review notes", body: preamble });
  return [...sections.filter(section => section.title === "Recommended direction"),
    ...sections.filter(section => section.title !== "Recommended direction")];
}

function sameText(left: string | null, right: string) {
  return !!left && left.replace(/\s+/g, " ").trim() === right.replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const review = await getStudioReviewDetail(id);
  return { title: { absolute: review ? `${review.reference} | Studio Console` : "Review | Studio Console" } };
}

export default async function StudioReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Independent guard: layouts alone do not secure RSC payloads or data reads.
  await requireStudioPage();
  const { id } = await params;
  const review = await getStudioReviewDetail(id);
  if (!review) notFound();
  const [eligible, plainLanguage, access] = await Promise.all([
    isClientAccessEligible(review.reference),
    getPlainLanguageProductReview(review.reference),
    getReviewAccessState(review.id),
  ]);
  const reportBase = `/reviews/${encodeURIComponent(review.reference)}`;
  const issuedVersion = review.reports.find(report => report.status === "issued")?.version ?? null;

  return <section className={`${styles.wide} ${styles.reviewDetail}`} aria-labelledby="review-title">
    <Link href="/studio/reviews" className={styles.backLink}>← Product Reviews</Link>
    <header className={styles.reviewOpening}>
      <div className={styles.reviewKicker}>
        <p className={styles.reviewReference}>{review.reference}</p>
        <span className={styles.badge}>{humanize(review.status)}</span>
        <span className={styles.badge}>{humanize(review.engagementType)}</span>
      </div>
      <h1 id="review-title">{review.product.name}</h1>
      <p className={styles.reviewClient}>{review.client.name}</p>
      <div className={styles.reviewQuestion}>
        <h2>Review question</h2>
        <p>{review.reviewQuestion}</p>
      </div>
      <dl className={styles.reviewMetadata}>
        <div><dt>Dates</dt><dd>{formatDate(review.startDate)} &ndash; {formatDate(review.endDate)}</dd></div>
        <div><dt>Environment</dt><dd>{review.environment}</dd></div>
        {review.timeSpentMinutes !== null && <div><dt>Time spent</dt><dd>{formatMinutes(review.timeSpentMinutes)}</dd></div>}
        <div><dt>Commercial value</dt><dd>{formatCommercialValue(review.commercialValueAmount, review.commercialValueCurrency)}
          {review.commercialNotes && <span className={styles.commercialNote}>{review.commercialNotes}</span>}
        </dd></div>
      </dl>
      <div className={styles.reviewScope}><h2>Scope</h2><p>{review.scope}</p></div>
    </header>

    <section className={styles.section} aria-labelledby="client-access-title">
      <h2 id="client-access-title" className={styles.sectionTitle}>Issued report &amp; client access</h2>
      <ReviewAccessPanel reviewId={review.id} reference={review.reference} eligible={eligible} issuedVersion={issuedVersion}
        status={access.status} expiresAt={access.expiresAt} lastAccessedAt={access.lastAccessedAt}
        portalUrl={`${studioAuthConfig().origin}/reviews?reference=${encodeURIComponent(review.reference)}`}
        plainHref={plainLanguage ? `${reportBase}/plain-language` : null} detailedHref={reportBase} />
    </section>

    {(review.notes || review.limitations) && <section className={styles.section} aria-labelledby="direction-title">
      <h2 id="direction-title" className={styles.sectionTitle}>Review direction &amp; context</h2>
      <div className={styles.reviewNotes}>
        {reviewNotes(review.notes).map(section => <section key={section.title}
          className={section.title === "Recommended direction" ? styles.recommendedDirection : styles.contextNote}>
          <h3>{section.title}</h3><p className={styles.textBlock}>{section.body}</p>
        </section>)}
        {review.limitations && <section className={styles.contextNote}>
          <h3>Review limitations</h3><p className={styles.textBlock}>{review.limitations}</p>
        </section>}
      </div>
    </section>}

    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Review coverage <span className={styles.sectionCount}>{review.journeys.length} journeys</span></h2>
      {review.journeys.length === 0
        ? <p className={styles.emptyState}>No journeys recorded.</p>
        : <ul className={styles.journeyList}>
            {review.journeys.map(journey => (
              <li key={journey.id} className={styles.journeyItem}>
                <h3>{journey.name}</h3>
                {journey.description && <p>{journey.description}</p>}
              </li>
            ))}
          </ul>}
    </div>

    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Findings <span className={styles.sectionCount}>{review.findings.length} recorded</span></h2>
      {review.findings.length === 0
        ? <p className={styles.emptyState}>No findings recorded.</p>
        : <ul className={styles.findingList}>
            {review.findings.map(finding => (
              <li key={finding.id} className={styles.findingCard}>
                <div className={styles.findingHead}>
                  <h3>{finding.title}</h3>
                  <p className={styles.findingLens}>Lens: {finding.lens}</p>
                  {finding.journeys.length > 0 && <ul className={styles.linkedJourneys} aria-label="Linked journeys">
                    {finding.journeys.map(journey => <li key={journey.id}>{journey.name}</li>)}
                  </ul>}
                </div>
                <div className={styles.decisionSignals}>
                  <span>{finding.classification}</span><span>{finding.horizon}</span>
                </div>
                <ul className={styles.verificationSignals} aria-label="Evidence and verification">
                  <li>Evidence: {finding.evidenceStatus}</li>
                  <li>Confidence: {finding.confidence}</li>
                  <li>Status: {humanize(finding.status)}</li>
                </ul>

                <h4 className={styles.findingLabel}>Observation</h4>
                <p className={styles.textBlock}>{finding.observation}</p>
                <h4 className={styles.findingLabel}>Consequence</h4>
                <p className={styles.textBlock}>{finding.consequence}</p>
                <h4 className={styles.findingLabel}>Recommendation</h4>
                <p className={styles.textBlock}>{finding.recommendation}</p>

                <h4 className={styles.findingLabel}>Evidence</h4>
                {finding.evidence.length === 0
                  ? <p className={styles.emptyState}>No evidence recorded.</p>
                  : <ul className={styles.evidenceList}>
                      {finding.evidence.map(item => {
                        const duplicate = item.kind === "note" && !item.url && !item.storagePath && sameText(item.description, finding.observation);
                        const content = <>
                          <p><strong>{item.title}</strong> ({item.kind})</p>
                          {item.description && <p className={styles.textBlock}>{item.description}</p>}
                          {(item.url || item.storagePath || item.capturedAt) && <p className={styles.evidenceMeta}>
                            {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>}
                            {item.url && item.storagePath && " \u00b7 "}
                            {item.storagePath && <span>{item.storagePath}</span>}
                            {item.capturedAt && <span> Captured {formatDate(item.capturedAt)}</span>}
                          </p>}
                        </>;
                        return <li key={item.id} className={styles.evidenceItem}>
                          {duplicate ? <details className={styles.duplicateEvidence}>
                            <summary>1 note &middot; repeats observation <span>&mdash; {item.title}</span></summary>
                            {content}
                          </details> : content}
                        </li>;
                      })}
                    </ul>}
              </li>
            ))}
          </ul>}
    </div>

    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Assumptions register</h2>
      {review.assumptions.length === 0
        ? <p className={styles.emptyState}>No assumptions recorded.</p>
        : <ul className={styles.assumptionList}>
            {review.assumptions.map(assumption => (
              <li key={assumption.id} className={styles.assumptionItem}>
                <p className={styles.assumptionReference}>{assumption.reference}</p>
                <p className={styles.textBlock}>{assumption.statement}</p>
                <div className={styles.badgeRow}>
                  <span className={styles.badge}>{assumption.status}</span>
                  <span className={styles.badge}>{assumption.confidence} confidence</span>
                </div>
              </li>
            ))}
          </ul>}
    </div>

    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Report versions</h2>
      {review.reports.length === 0
        ? <p className={styles.emptyState}>No report versions yet.</p>
        : <ul className={styles.reportList}>
            {review.reports.map(report => (
              <li key={report.id} className={styles.reportItem}>
                <span><strong>Version {report.version}</strong> — {humanize(report.status)}</span>
                <p>{formatDateTime(report.createdAt)}</p>
                {report.notes && <p>{report.notes}</p>}
              </li>
            ))}
          </ul>}
    </div>
  </section>;
}
