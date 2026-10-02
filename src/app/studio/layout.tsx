import type { Metadata } from "next";
import Link from "next/link";
import AiFormLockup from "@/components/AiFormLockup";
import styles from "./studio.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Studio Console | AiForm Studio" },
  description: "Private AiForm Studio workspace.",
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: null },
  openGraph: { title: "Studio Console", description: "Private workspace", images: [], url: null },
  twitter: { title: "Studio Console", description: "Private workspace", images: [] },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.workspace}>
    <header className={styles.header}>
      <Link href="/" className={styles.brandLink} aria-label="AiForm Studio public website">
        <AiFormLockup product="Studio" variant="studio" />
      </Link>
      <div className={styles.headerActions}>
        <span className={styles.headerLabel}>Private workspace</span>
        <Link href="/" className={styles.publicStudioLink}>Public Studio <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
    <div className={styles.content}>{children}</div>
    <footer className={styles.footer}>AiForm Studio <span>Pretoria, South Africa</span></footer>
  </div>;
}
