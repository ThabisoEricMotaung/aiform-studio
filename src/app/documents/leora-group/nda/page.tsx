import type { Metadata } from "next";
import Link from "next/link";
import { LEORA_DOCUMENT } from "@/lib/leora-document";
import DocumentExecutionStatus from "@/components/documents/ExecutionStatus";
import documentStyles from "@/app/share/share.module.css";
import styles from "./page.module.css";

const pdfPath = LEORA_DOCUMENT.pdfPath;
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
          <article className={documentStyles.document} aria-labelledby="agreement-title">
            <p className={documentStyles.eyebrow}>Client document</p>
            <h1 id="agreement-title">Mutual <span className={styles.unbroken}>Non-Disclosure</span><br />Agreement</h1>
            <p className={`${documentStyles.recipient} ${styles.relationship}`}>AiForm Studio <span>×</span> LeOra Group</p>
            <p className={`${documentStyles.description} ${styles.description}`}>{description}</p>
            <dl className={`${documentStyles.metadata} ${styles.metadata}`}>
              <div><dt>Document</dt><dd>Mutual NDA</dd></div>
              <div><dt>Parties</dt><dd>AiForm Studio × LeOra Group</dd></div>
              <div><dt>Status</dt><dd className={documentStyles.status}><DocumentExecutionStatus /></dd></div>
              <div><dt>Date</dt><dd><time dateTime="2026-09-16">16 September 2026</time></dd></div>
            </dl>
            <div className={`${documentStyles.actions} ${styles.actions}`}>
              <Link href="/documents/leora-group/nda/sign" className={`button-primary ${styles.primary}`}>
                Review &amp; sign <span aria-hidden="true">→</span>
              </Link>
              <a href={pdfPath} download className={`button-secondary ${styles.secondary}`} aria-label="Download PDF: AiForm Studio × LeOra Group Mutual NDA">
                Download PDF <span aria-hidden="true">↓</span>
              </a>
            </div>
          </article>
  );
}
