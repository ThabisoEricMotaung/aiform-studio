import { notFound } from "next/navigation";
import { getSharedDocument, sharedDocuments } from "@/content/sharedDocuments";
import styles from "../share.module.css";

// The registry defines which document routes are available.
export const dynamicParams = false;
export function generateStaticParams() {
  return sharedDocuments.map(({ slug }) => ({ slug }));
}

export default async function SharedDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const document = getSharedDocument(slug);
  if (!document) notFound();

  const viewLabel = document.viewLabel ?? "View document";
  return (
    <article className={styles.document} data-accent={document.accent ?? "green"}>
      <p className={styles.eyebrow}>{document.category ? `${document.category} document` : "Client document"}</p>
      <h1>{document.title}</h1>
      <p className={styles.recipient}>AiForm Studio <span aria-hidden="true">×</span> {document.recipient}</p>
      <div className={styles.statusRow}>
        <p className={styles.status}>{document.status}</p>
        <p>Prepared {document.date}</p>
      </div>
      <p className={styles.description}>{document.description}</p>
      <dl className={styles.metadata}>
        <div><dt>Prepared for</dt><dd>{document.recipient}</dd></div>
        <div><dt>Prepared by</dt><dd>{document.preparedBy}</dd></div>
        {document.version ? <div><dt>Version</dt><dd>{document.version}</dd></div> : null}
        {document.projectName ? <div><dt>Project</dt><dd>{document.projectName}</dd></div> : null}
      </dl>
      <div className={styles.actions}>
          <a href="#document-preview" className="button-primary">{viewLabel}<span aria-hidden="true">↓</span></a>
          <a href={document.pdfPath} download className="button-secondary">Download PDF<span aria-hidden="true">↗</span></a>
      </div>
      <p className={styles.note}>{document.reviewNote ?? "This document has been prepared specifically for the recipient named above. Please review it and contact AiForm Studio if you would like to propose any changes."}</p>
      <section id="document-preview" className={styles.preview} aria-labelledby="preview-title">
        <div className={styles.previewHeader}>
          <h2 id="preview-title">Document preview</h2>
          <a href={document.pdfPath} target="_blank" rel="noopener noreferrer">Open PDF in a new tab <span aria-hidden="true">↗</span></a>
        </div>
        <p className={styles.previewHint}>If the preview doesn’t display on your device, open the PDF in a new tab or download it above.</p>
        <iframe src={document.pdfPath} title={`PDF preview: ${document.title}`} loading="lazy" />
      </section>
    </article>
  );
}
