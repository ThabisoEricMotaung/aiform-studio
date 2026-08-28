"use client";

import { useEffect, useRef, useState } from "react";
import { IconCalendar } from "./icons";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, string>;
      }) => void;
    };
  }
}

let calendlyScriptPromise: Promise<void> | null = null;

function loadCalendlyScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (calendlyScriptPromise) return calendlyScriptPromise;

  calendlyScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      calendlyScriptPromise = null;
      reject(new Error("Failed to load Calendly"));
    };
    document.body.appendChild(script);
  });
  return calendlyScriptPromise;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

// Calendly honours ?name=&email= directly on the event URL — this is the
// prefill mechanism it documents for plain links, and it's what actually
// reaches the booking form; the initInlineWidget `prefill` option alone
// isn't reliably reflected in the resulting embed. Applying both is
// redundant but harmless.
function buildPrefilledUrl(url: string, name?: string, email?: string): string {
  try {
    const withPrefill = new URL(url);
    if (name) withPrefill.searchParams.set("name", name);
    if (email) withPrefill.searchParams.set("email", email);
    return withPrefill.toString();
  } catch {
    return url;
  }
}

type CalendlyBookingProps = {
  name?: string;
  email?: string;
  triggerLabel?: string;
  triggerSubtitle?: string;
  triggerClassName?: string;
  onOpen?: () => void;
};

export default function CalendlyBooking({
  name,
  email,
  triggerLabel = "Book a conversation",
  triggerSubtitle = "30-minute Studio conversation",
  triggerClassName = "contact-alt-action",
  onOpen,
}: CalendlyBookingProps) {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;
  const [open, setOpen] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const prefilledUrl = calendlyUrl ? buildPrefilledUrl(calendlyUrl, name, email) : undefined;

  useEffect(() => {
    if (!open || !prefilledUrl) return;
    let cancelled = false;

    loadCalendlyScript()
      .then(() => {
        if (cancelled || !embedContainerRef.current || !window.Calendly) return;
        embedContainerRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: prefilledUrl,
          parentElement: embedContainerRef.current,
          prefill: {
            ...(name ? { name } : {}),
            ...(email ? { email } : {}),
          },
        });
      })
      .catch(() => {
        if (!cancelled) setEmbedFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [open, prefilledUrl, name, email]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [open]);

  if (!calendlyUrl) return null;

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onClick={() => {
          setEmbedFailed(false);
          setOpen(true);
          onOpen?.();
        }}
      >
        <span className="contact-alt-action-icon" aria-hidden="true">
          <IconCalendar />
        </span>
        <span className="contact-alt-action-body">
          <span className="contact-alt-action-title">{triggerLabel}</span>
          <span className="contact-alt-action-subtitle">{triggerSubtitle}</span>
        </span>
      </button>

      {open ? (
        <div className="calendly-overlay" onMouseDown={() => setOpen(false)}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendly-dialog-title"
            className="calendly-dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="calendly-dialog-header">
              <div>
                <p className="chapter-label uppercase">Studio Conversation</p>
                <h2 id="calendly-dialog-title" className="calendly-dialog-title">
                  Book a conversation
                </h2>
                <p className="calendly-dialog-subtitle">
                  A short conversation about what you&apos;re trying to build, fix or explore.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="calendly-dialog-close"
                onClick={() => setOpen(false)}
                aria-label="Close booking dialog"
              >
                ✕
              </button>
            </div>

            {embedFailed ? (
              <p className="field-help mt-6">
                The booking widget couldn&apos;t load. You can open it directly instead.
              </p>
            ) : (
              <div ref={embedContainerRef} className="calendly-embed-container" />
            )}

            <a
              href={prefilledUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="calendly-fallback-link"
            >
              Open in a new tab instead ↗
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
