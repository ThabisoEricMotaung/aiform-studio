import type { Metadata } from "next";
import Link from "next/link";
import SigningFlow from "@/components/documents/SigningFlow";
import { signingConfig } from "@/lib/leora-signing-server";
import documentStyles from "@/app/share/share.module.css";
import styles from "./sign.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Review & sign | AiForm Studio × LeOra Group" },
  description: "Review and electronically sign the issued Mutual Non-Disclosure Agreement.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function SigningPage() {
  let available = false;
  try { signingConfig(); available = true; } catch { /* Fail closed until configured. */ }
  return (
    <article className={`${documentStyles.document} ${styles.flow}`}>
      <Link href="/documents/leora-group/nda" className={styles.back}>← Document overview</Link>
      <p className={documentStyles.eyebrow}>Client document · Electronic signing</p>
      <h1>Review &amp; sign</h1>
      <p className={documentStyles.recipient}>Mutual Non-Disclosure Agreement</p>
      <p className={documentStyles.description}>AiForm Studio × LeOra Group</p>
      <SigningFlow available={available} />
    </article>
  );
}
