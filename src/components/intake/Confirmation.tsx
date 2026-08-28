import Link from "next/link";
import CalendlyBooking from "@/components/contact/CalendlyBooking";

type ConfirmationProps = {
  name?: string;
  email?: string;
};

export default function Confirmation({ name, email }: ConfirmationProps) {
  return (
    <div className="intake-panel" role="status">
      <p className="chapter-label">Sent</p>
      <h2 id="confirmation-heading" className="secondary-title intake-question-title mt-4">
        Got it. I&apos;ll read this properly.
      </h2>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">
        If there&apos;s enough context, I&apos;ll come back with the next useful question rather
        than a generic sales response.
      </p>

      <div className="mt-9 border-t border-line pt-7">
        <p className="chapter-label mb-3">Want to talk it through?</p>
        <p className="text-sm leading-relaxed text-muted">Choose a time that works for you.</p>
        <div className="mt-4">
          <CalendlyBooking
            name={name}
            email={email}
            triggerLabel="Book a conversation →"
          />
        </div>
      </div>

      <Link href="/" className="link-arrow mt-8 inline-flex">
        Back to the Studio
      </Link>
    </div>
  );
}
