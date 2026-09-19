import type { Metadata } from "next";
import Link from "next/link";
import StudioCountersignFlow from "@/components/documents/StudioCountersignFlow";
import { studioCountersignConfig } from "@/lib/studio-countersign-server";
import documentStyles from "@/app/share/share.module.css";
import styles from "../sign/sign.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Studio countersigning | AiForm Studio × LeOra Group" },
  description: "Studio-only countersigning workflow for the executed Mutual Non-Disclosure Agreement.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function StudioCountersignPage() {
  let available = false;
  try { studioCountersignConfig(); available = true; } catch { /* Fail closed until configured. */ }
  return (
    <article className={`${documentStyles.document} ${styles.flow}`}>
      <Link href="/documents/leora-group/nda" className={styles.back}>← Document overview</Link>
      <p className={documentStyles.eyebrow}>Studio-only · Countersigning</p>
      <h1>Studio countersigning</h1>
      <p className={documentStyles.recipient}>Mutual Non-Disclosure Agreement</p>
      <p className={documentStyles.description}>AiForm Studio × LeOra Group</p>
      <StudioCountersignFlow available={available} />
    </article>
  );
}
