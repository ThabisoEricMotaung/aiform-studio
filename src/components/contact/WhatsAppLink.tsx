"use client";

import { buildWhatsAppHref } from "@/lib/contact-links";
import { IconWhatsApp } from "./icons";

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
