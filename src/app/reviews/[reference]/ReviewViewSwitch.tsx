import Link from "next/link";
import styles from "./report.module.css";

export default function ReviewViewSwitch({ reference, current }: { reference: string; current: "detailed" | "plain" }) {
  const base = `/reviews/${encodeURIComponent(reference)}`;
  return <nav className={styles.viewSwitch} aria-label="Review version">
    <Link href={base} aria-current={current === "detailed" ? "page" : undefined}>Detailed review</Link>
    <span aria-hidden="true">|</span>
    <Link href={`${base}/plain-language`} aria-current={current === "plain" ? "page" : undefined}>Plain-language review</Link>
  </nav>;
}
