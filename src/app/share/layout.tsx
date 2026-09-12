import type { Metadata } from "next";
import Link from "next/link";
import AiFormLockup from "@/components/AiFormLockup";
import styles from "./share.module.css";

export const metadata: Metadata = {
  title: { absolute: "Client Document | AiForm Studio" },
  description: "A document prepared by AiForm Studio for a named recipient.",
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: null },
  openGraph: {
    title: "Client Document | AiForm Studio",
    description: "A document prepared by AiForm Studio.",
    images: [],
    url: null,
  },
  twitter: {
    card: "summary",
    title: "Client Document | AiForm Studio",
    description: "A document prepared by AiForm Studio.",
    images: [],
  },
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" aria-label="AiForm Studio home"><AiFormLockup product="Studio" markClassName="h-8" /></Link>
        <span className={styles.label}>Client document</span>
      </header>
      <div className={styles.content}>{children}</div>
      <footer className={styles.footer}>
        <p>AiForm Studio (Pty) Ltd<span>Pretoria, South Africa</span></p>
        <Link href="/">aiformstudio.co.za</Link>
      </footer>
    </div>
  );
}
