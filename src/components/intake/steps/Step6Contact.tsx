import { preferredContactOptions } from "@/lib/inquiry";
import OptionRow from "../OptionRow";
import type { StepProps } from "../types";

export default function Step6Contact({ draft, errors, update }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="secondary-title">Your contact details</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            className="field-input"
            aria-invalid={Boolean(errors.name)}
            value={draft.name ?? ""}
            onChange={(event) => update({ name: event.target.value })}
          />
          {errors.name ? (
            <p className="field-error" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className="field-label" htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            className="field-input"
            aria-invalid={Boolean(errors.email)}
            value={draft.email ?? ""}
            onChange={(event) => update({ email: event.target.value })}
          />
          {errors.email ? (
            <p className="field-error" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label className="field-label" htmlFor="contact-phone">
            WhatsApp / phone <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            className="field-input"
            aria-invalid={Boolean(errors.phone)}
            value={draft.phone ?? ""}
            onChange={(event) => update({ phone: event.target.value })}
          />
          {errors.phone ? (
            <p className="field-error" role="alert">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div>
          <label className="field-label" htmlFor="contact-org">
            Organisation / company <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="contact-org"
            type="text"
            autoComplete="organization"
            className="field-input"
            value={draft.organisation ?? ""}
            onChange={(event) => update({ organisation: event.target.value })}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="contact-role">
            Role <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="contact-role"
            type="text"
            autoComplete="organization-title"
            className="field-input"
            value={draft.role ?? ""}
            onChange={(event) => update({ role: event.target.value })}
          />
        </div>
      </div>

      <div>
        <span className="field-label">
          How would you prefer I respond? <span className="font-normal text-muted">(optional)</span>
        </span>
        <div
          className="flex flex-wrap gap-3"
          role="radiogroup"
          aria-label="How would you prefer I respond?"
        >
          {preferredContactOptions.map((option) => (
            <OptionRow
              key={option.value}
              type="radio"
              name="preferredContact"
              value={option.value}
              label={option.label}
              checked={draft.preferredContact === option.value}
              onChange={() => update({ preferredContact: option.value })}
            />
          ))}
        </div>
      </div>

      {/* Honeypot: invisible to real visitors, left for bots to fill in. */}
      <div className="intake-honeypot" aria-hidden="true">
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={draft.honeypot ?? ""}
          onChange={(event) => update({ honeypot: event.target.value })}
        />
      </div>

      <p className="field-help max-w-xl">
        By sending this, you&apos;re sharing project information with AiForm Studio so I can
        respond to your enquiry. Please don&apos;t include passwords or other sensitive
        credentials.
      </p>
    </div>
  );
}
