"use client";

import { IconWhatsApp } from "./icons";

const WHATSAPP_MESSAGE = "Hi AiForm Studio, I'd like to talk about something I'm working on.";

function buildWhatsAppHref(rawNumber: string): string {
  const digitsOnly = rawNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}

type WhatsAppLinkProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  onOpen?: () => void;
};

export default function WhatsAppLink({
  className = "contact-alt-action",
  title = "Chat on WhatsApp",
  subtitle = "Start a quick conversation",
  onOpen,
}: WhatsAppLinkProps) {
  const number = process.env.NEXT_PUBLIC_STUDIO_WHATSAPP;
  if (!number) return null;

  return (
    <a
      href={buildWhatsAppHref(number)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onOpen}
    >
      <span className="contact-alt-action-icon" aria-hidden="true">
        <IconWhatsApp />
      </span>
      <span className="contact-alt-action-body">
        <span className="contact-alt-action-title">{title}</span>
        <span className="contact-alt-action-subtitle">{subtitle}</span>
      </span>
    </a>
  );
}
