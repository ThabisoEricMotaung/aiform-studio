"use client";

import CalendlyBooking from "./CalendlyBooking";
import WhatsAppLink from "./WhatsAppLink";

export default function AlternativeContact() {
  const calendlyConfigured = Boolean(process.env.NEXT_PUBLIC_CALENDLY_URL);
  const whatsappConfigured = Boolean(process.env.NEXT_PUBLIC_STUDIO_WHATSAPP);

  if (!calendlyConfigured && !whatsappConfigured) return null;

  return (
    <div className="mt-9 border-t border-line pt-7">
      <p className="chapter-label mb-3">Prefer to talk first?</p>
      <p className="text-sm leading-relaxed text-muted">
        If you&apos;d rather talk it through, book a short conversation or send us a message.
      </p>
      <div className="mt-4">
        <CalendlyBooking />
        <WhatsAppLink />
      </div>
    </div>
  );
}
