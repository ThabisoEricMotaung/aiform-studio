import Link from "next/link";

export default function Confirmation() {
  return (
    <div className="intake-panel" role="status">
      <p className="chapter-label">Sent</p>
      <h2 id="confirmation-heading" className="secondary-title mt-4">
        Got it. I&apos;ll read this properly.
      </h2>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">
        If there&apos;s enough context, I&apos;ll come back with the next useful question rather
        than a generic sales response.
      </p>
      <Link href="/" className="link-arrow mt-8 inline-flex">
        Back to the Studio
      </Link>
    </div>
  );
}
