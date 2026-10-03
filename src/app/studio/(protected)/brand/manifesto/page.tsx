import type { Metadata } from "next";
import Link from "next/link";
import { requireStudioPage } from "@/lib/studio-auth";
import styles from "../../../studio.module.css";

export const metadata: Metadata = { title: { absolute: "AiForm Manifesto | Studio Console" } };

export default async function StudioManifestoPage() {
  // Independent guard: layouts alone do not secure RSC payloads or data reads.
  await requireStudioPage();
  return <section className={styles.wide} aria-labelledby="manifesto-title">
    <Link href="/studio" className={styles.backLink}>← Studio console</Link>
    <div className={styles.assetLayout}>
      <div>
        <p className={styles.eyebrow}>AiForm Studio / Brand</p>
        <h1 id="manifesto-title" className={styles.assetTitle}>AiForm Manifesto</h1>
        <p className={styles.assetMeta}>15 sec · 1080 × 1920 · Vertical</p>
      </div>
      <video
        className={styles.assetVideo}
        src="/studio/brand/aiform-manifesto.mp4"
        poster="/studio/brand/aiform-manifesto-poster.jpg"
        width={1080}
        height={1920}
        controls
        playsInline
        preload="metadata"
        aria-labelledby="manifesto-title"
      />
    </div>
  </section>;
}
