import type { Metadata } from "next";
import Link from "next/link";
import { requireStudioPage } from "@/lib/studio-auth";
import { listStudioReviews } from "@/lib/studio-reviews";
import { formatDate, humanize } from "@/lib/studio-review-format";
import styles from "../../studio.module.css";

export const metadata: Metadata = { title: { absolute: "Product Reviews | Studio Console" } };

export default async function StudioReviewsPage() {
  // Independent guard: layouts alone do not secure RSC payloads or data reads.
  await requireStudioPage();
  const reviews = await listStudioReviews();

  return <section className={styles.wide} aria-labelledby="reviews-title">
    <Link href="/studio" className={styles.backLink}>← Studio console</Link>
    <p className={styles.eyebrow}>AiForm Studio / Private workspace</p>
    <h1 id="reviews-title">Product Reviews</h1>
    <p className={styles.intro}>{reviews.length === 0 ? "No reviews recorded yet." : `${reviews.length} review${reviews.length === 1 ? "" : "s"} on record.`}</p>

    {reviews.length > 0 && <ul className={styles.reviewList}>
      {reviews.map(review => (
        <li key={review.id}>
          <Link href={`/studio/reviews/${review.id}`} className={styles.reviewCard}>
            <div className={styles.reviewCardHead}>
              <span className={styles.reviewReference}>{review.reference}</span>
              <span className={styles.badge}>{humanize(review.status)}</span>
            </div>
            <p className={styles.reviewCardMeta}>{review.clientName} · {review.productName}</p>
            <p className={styles.reviewCardMeta}>{humanize(review.engagementType)} · {review.environment} · {formatDate(review.startDate)}–{formatDate(review.endDate)}</p>
          </Link>
        </li>
      ))}
    </ul>}
  </section>;
}
