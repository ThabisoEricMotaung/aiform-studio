import type { Metadata } from "next";
import Link from "next/link";
import AiFormLockup from "@/components/AiFormLockup";
import documentStyles from "@/app/share/share.module.css";
import styles from "./page.module.css";

const pdfPath = "/documents/leora-group/AiForm-Studio-LeOra-Group-Mutual-NDA.pdf";
const title = "Mutual NDA | AiForm Studio × LeOra Group";
const description = "This mutual non-disclosure agreement governs confidential discussions between AiForm Studio and LeOra Group concerning the proposed NeoSmart Fuelling platform and related vehicle, energy, logistics and technology systems.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: null },
  openGraph: { title, description: "A client document prepared by AiForm Studio.", images: [], url: null },
  twitter: { card: "summary", title, description: "A client document prepared by AiForm Studio.", images: [] },
};

export default function LeOraAgreementPage() {
  return (
    <div className={styles.page}>
      <div className={documentStyles.shell}>
        <header className={`${documentStyles.header} ${styles.header}`}>
          <Link href="/" aria-label="AiForm Studio home">
            <AiFormLockup product="Studio" markClassName="h-8" />
          </Link>
          <span className={documentStyles.label}>Documents</span>
        </header>
        <div className={documentStyles.content}>
          <article className={documentStyles.document} aria-labelledby="agreement-title">
            <p className={documentStyles.eyebrow}>Client document</p>
            <h1 id="agreement-title">Mutual <span className={styles.unbroken}>Non-Disclosure</span><br />Agreement</h1>
            <p className={`${documentStyles.recipient} ${styles.relationship}`}>AiForm Studio <span>×</span> LeOra Group</p>
            <p className={`${documentStyles.description} ${styles.description}`}>{description}</p>
            <dl className={`${documentStyles.metadata} ${styles.metadata}`}>
              <div><dt>Document</dt><dd>Mutual NDA</dd></div>
              <div><dt>Parties</dt><dd>AiForm Studio × LeOra Group</dd></div>
              <div><dt>Status</dt><dd className={documentStyles.status}>Ready for signature</dd></div>
              <div><dt>Date</dt><dd><time dateTime="2026-09-16">16 September 2026</time></dd></div>
            </dl>
            <div className={`${documentStyles.actions} ${styles.actions}`}>
              <a href={pdfPath} target="_blank" rel="noopener noreferrer" className={`button-primary ${styles.primary}`} aria-label="View agreement: AiForm Studio × LeOra Group Mutual NDA (PDF, opens in a new tab)">
                View agreement <span aria-hidden="true">↗</span>
              </a>
              <a href={pdfPath} download className={`button-secondary ${styles.secondary}`} aria-label="Download PDF: AiForm Studio × LeOra Group Mutual NDA">
                Download PDF <span aria-hidden="true">↓</span>
              </a>
            </div>
          </article>
        </div>
        <footer className={documentStyles.footer}>
          <p>Prepared by AiForm Studio<span>Pretoria, South Africa</span></p>
          <p>© 2026 AiForm Studio (Pty) Ltd</p>
        </footer>
      </div>
    </div>
  );
}
