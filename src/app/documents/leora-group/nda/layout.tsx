import type { Metadata } from "next";
import Link from "next/link";
import AiFormLockup from "@/components/AiFormLockup";
import documentStyles from "@/app/share/share.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: null },
  referrer: "no-referrer",
  openGraph: { title: "Client document | AiForm Studio", images: [], url: null },
  twitter: { card: "summary", title: "Client document | AiForm Studio", images: [] },
};

export default function LeOraDocumentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={documentStyles.shell}>
        <header className={`${documentStyles.header} ${styles.header}`}>
          <Link href="/" aria-label="AiForm Studio home"><AiFormLockup product="Studio" variant="studio" markClassName="h-8" /></Link>
          <span className={documentStyles.label}>Documents</span>
        </header>
        <div className={documentStyles.content}>{children}</div>
        <footer className={documentStyles.footer}>
          <p>Prepared by AiForm Studio<span>Pretoria, South Africa</span></p>
          <p>© 2026 AiForm Studio (Pty) Ltd</p>
        </footer>
      </div>
    </div>
  );
}
