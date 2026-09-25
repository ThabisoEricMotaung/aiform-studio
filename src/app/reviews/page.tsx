import type { Metadata } from "next";
import { normalizeReference } from "@/lib/review-access";
import ReviewAccessForm from "./ReviewAccessForm";
import styles from "./access.module.css";

export const dynamic = "force-dynamic";

const title = "Access your Product Review | AiForm Studio";
const description = "Enter the review reference and access code provided by AiForm Studio.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: null },
  openGraph: { title, description, images: [], url: null },
  twitter: { card: "summary", title, description, images: [] },
};

export default async function ReviewAccessPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  // Prefill only: a reference is not a credential and its presence here reveals nothing.
  const reference = normalizeReference((await searchParams).reference) ?? "";
  return <main className={styles.page}>
    <div className={styles.sheet}>
      <header className={styles.masthead}><span>AiForm <strong>Studio</strong></span><span>Product Review</span></header>
      <section className={styles.panel} aria-labelledby="access-title">
        <p className={styles.kicker}>Client access</p>
        <h1 id="access-title">Access your Product Review</h1>
        <p className={styles.intro}>{description}</p>
        <ReviewAccessForm reference={reference} />
      </section>
      <footer className={styles.footer}><span>AiForm Studio &middot; Product Review</span><span>Pretoria, South Africa</span></footer>
    </div>
  </main>;
}
