import type { Metadata } from "next";
import Link from "next/link";
import AiFormLockup from "@/components/AiFormLockup";
import documentStyles from "@/app/share/share.module.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: { absolute: "Invoice | AiForm Studio" },
  description: "An invoice prepared by AiForm Studio for a named client.",
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: null },
  openGraph: { title: "Invoice | AiForm Studio", description: "An invoice prepared by AiForm Studio.", images: [], url: null },
  twitter: { card: "summary", title: "Invoice | AiForm Studio", description: "An invoice prepared by AiForm Studio.", images: [] },
};

export default function InvoicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={documentStyles.shell}>
        <header className={`${documentStyles.header} ${styles.header}`}>
          <Link href="/" aria-label="AiForm Studio home"><AiFormLockup product="Studio" variant="studio" markClassName="h-8" /></Link>
          <span className={documentStyles.label}>Documents</span>
        </header>
        <div className={`${documentStyles.content} ${styles.printContent}`}>{children}</div>
        <footer className={`${documentStyles.footer} ${styles.footer}`}>
          <p>AiForm Studio (Pty) Ltd<span>Registration 2026/692621/07</span><span>© 2026 AiForm Studio (Pty) Ltd</span></p>
          <p>aiformstudio@gmail.com<span>Pretoria, South Africa</span></p>
        </footer>
      </div>
    </div>
  );
}
