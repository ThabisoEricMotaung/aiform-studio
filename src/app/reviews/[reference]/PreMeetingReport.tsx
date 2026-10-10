import PrintButton from "@/components/documents/PrintButton";
import type { getPreMeetingProductReview } from "@/lib/pre-meeting-product-review";
import { humanize } from "@/lib/studio-review-format";
import styles from "./report.module.css";

type Result = NonNullable<Awaited<ReturnType<typeof getPreMeetingProductReview>>>;

export default function PreMeetingReport({ review, copy }: Result) {
  return <article className={styles.report} aria-labelledby="report-title">
    <div className={styles.sheet}>
      <header className={styles.masthead}><span>AiForm <strong>Studio</strong></span><span>Product Review</span></header>
      <header className={styles.opening}>
        <p className={styles.kicker}>Product Review <span>{review.reference}</span></p>
        <h1 id="report-title" className={styles.reportTitle}>{copy.title}</h1>
        <p className={styles.client}>Prepared for {copy.preparedFor}</p>
        <dl className={styles.metadata}>
          <div><dt>Report</dt><dd>{humanize(review.status)} &middot; Version {review.version}</dd></div>
          <div><dt>Date</dt><dd>{copy.date}</dd></div>
          <div><dt>Prepared by</dt><dd>{copy.preparedBy}</dd></div>
          <div><dt>Engagement</dt><dd>{copy.engagement}</dd></div>
          <div><dt>Reviewed website</dt><dd>{copy.website}</dd></div>
        </dl>
        <div className={styles.printAction}><PrintButton className="button-secondary" /></div>
      </header>

      <section className={styles.section} aria-labelledby="executive">
        <h2 id="executive" className={styles.sectionHeading}><span>01</span> Executive assessment</h2>
        <div className={styles.recommendation}>{copy.executive.map(text => <p key={text} className={styles.prose}>{text}</p>)}</div>
      </section>

      <section className={styles.section} aria-labelledby="actions">
        <h2 id="actions" className={styles.sectionHeading}><span>02</span> Action summary</h2>
        <div className={styles.actionGroups}>{copy.actions.map(group => <section key={group.horizon}>
          <h3>{group.horizon}</h3>
          <ul className={styles.plainList}>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
        </section>)}</div>
        <div className={styles.plainPreserve}><h3>What should remain</h3><p className={styles.prose}>{copy.preserve}</p></div>
      </section>

      <section className={styles.section} aria-labelledby="clarification">
        <h2 id="clarification" className={styles.sectionHeading}><span>03</span> Client clarification</h2>
        <ul className={styles.plainList}>{copy.clarifications.map(text => <li key={text}>{text}</li>)}</ul>
      </section>

      <section className={styles.section} aria-labelledby="journey">
        <h2 id="journey" className={styles.sectionHeading}><span>04</span> Journey map</h2>
        <ul className={styles.assumptions}>{copy.journey.map(item => <li key={item.stage}>
          <span className={styles.stageLabel}>{item.stage}</span><p className={styles.prose}>{item.text}</p>
        </li>)}</ul>
        <h3 className={styles.subheading}>Simulated customer perspectives</h3>
        <div className={styles.directionGrid}>{copy.perspectives.map(item => <section key={item.role} className={styles.context}>
          <h3>{item.role}</h3><p className={styles.prose}>{item.text}</p>
        </section>)}</div>
        <p className={styles.verification}>{copy.perspectivesNote}</p>
      </section>

      <section className={styles.section} aria-labelledby="findings">
        <h2 id="findings" className={styles.sectionHeading}><span>05</span> Findings</h2>
        <p className={styles.verification}>{copy.findingsNote}</p>
        {copy.findings.map(finding => <section key={finding.reference} className={styles.finding} aria-labelledby={finding.reference}>
          <header className={styles.findingHeader}>
            <p className={styles.plainReference}>{finding.reference}</p>
            <h3 id={finding.reference}>{finding.title}</h3>
            <dl className={styles.signals}>
              <div><dt>Classification</dt><dd>{finding.priority}</dd></div>
              <div><dt>Horizon</dt><dd>{finding.horizon}</dd></div>
            </dl>
            <p className={styles.verification}>{finding.basis} &middot; {finding.confidence.toLowerCase()}</p>
          </header>
          <div className={styles.findingBody}>
            {finding.observed && <section><h4>Observed</h4><p className={styles.prose}>{finding.observed}</p></section>}
            {finding.clarification && <section><h4>Client clarification</h4><p className={styles.prose}>{finding.clarification}</p></section>}
            {finding.consequence && <section><h4>Potential consequence</h4><p className={styles.prose}>{finding.consequence}</p></section>}
            <section className={styles.findingRecommendation}><h4>Recommendation</h4><p className={styles.prose}>{finding.recommendation}</p></section>
            {finding.note && <p className={styles.verification}>{finding.note}</p>}
          </div>
        </section>)}
      </section>

      <section className={styles.section} aria-labelledby="improvements">
        <h2 id="improvements" className={styles.sectionHeading}><span>06</span> Additional explanatory improvements</h2>
        <ul className={styles.plainList}>{copy.improvements.map(text => <li key={text}>{text}</li>)}</ul>
      </section>

      <section className={styles.section} aria-labelledby="limitations">
        <h2 id="limitations" className={styles.sectionHeading}><span>07</span> Coverage and limitations</h2>
        {copy.coverage.map(group => <div key={group.title} className={styles.plainPreserve}>
          <h3>{group.title}</h3>
          <ul className={styles.plainList}>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
        </div>)}
      </section>

      <section className={styles.section} aria-labelledby="questions">
        <h2 id="questions" className={styles.sectionHeading}><span>08</span> Open questions</h2>
        <ol className={styles.numberedList}>{copy.questions.map(text => <li key={text}>{text}</li>)}</ol>
      </section>

      <section className={styles.section} aria-labelledby="sequence">
        <h2 id="sequence" className={styles.sectionHeading}><span>09</span> Recommended sequence</h2>
        <ul className={styles.assumptions}>{copy.sequence.map(item => <li key={item.step}>
          <span className={styles.stageLabel}>{item.step}</span><p className={styles.prose}>{item.text}</p>
        </li>)}</ul>
      </section>

      <section className={styles.section} aria-labelledby="status">
        <h2 id="status" className={styles.sectionHeading}><span>10</span> Status and sources</h2>
        <div className={styles.plainPreserve}><h3>Status statement</h3><p className={styles.prose}>{copy.status}</p></div>
        <div className={styles.plainPreserve}><h3>Source record</h3>{copy.source.map(text => <p key={text} className={styles.prose}>{text}</p>)}</div>
      </section>
      <footer className={styles.footer}><span>AiForm Studio &middot; Product Review</span><span>{review.reference} &middot; Version {review.version}</span></footer>
    </div>
  </article>;
}
