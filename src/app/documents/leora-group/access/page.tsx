import type { Metadata } from "next";
import Link from "next/link";
import AiFormLockup from "@/components/AiFormLockup";
import LeoraAccessForm from "@/components/documents/LeoraAccessForm";
import { resolveLeoraNextPath } from "@/lib/leora-access";
import documentStyles from "@/app/share/share.module.css";
import styles from "./access.module.css";

export const dynamic = "force-dynamic";

const title = "Private access | AiForm Studio × LeOra Group";
const description = "Enter your private access code to view LeOra Group's private commercial documents.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: null },
  openGraph: { title, description, images: [], url: null },
  twitter: { card: "summary", title, description, images: [] },
};

export default async function LeoraPrivateAccess({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const destination = resolveLeoraNextPath(next);
  return (
    <div className={styles.page}>
      <div className={documentStyles.shell}>
        <header className={documentStyles.header}>
          <Link href="/" aria-label="AiForm Studio home"><AiFormLockup product="Studio" variant="studio" markClassName="h-8" /></Link>
          <span className={documentStyles.label}>Documents</span>
        </header>
        <div className={documentStyles.content}>
          <article className={documentStyles.document} aria-labelledby="access-title">
            <p className={documentStyles.eyebrow}>Client document · Private access</p>
            <h1 id="access-title">Private access</h1>
            <p className={`${documentStyles.description}`}>{description}</p>
            <LeoraAccessForm next={destination} />
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
