import { timelineOptions, budgetOptions } from "@/lib/inquiry";
import OptionRow from "../OptionRow";
import type { StepProps } from "../types";

const IMPLIES_EXISTING = new Set(["existing_system", "already_built", "needs_fixing"]);

export default function Step6Practical({ draft, errors, update }: StepProps) {
  // Budget framing assumes a commissioned, paid engagement — skip it for
  // people exploring a collaboration rather than asking us to build for them.
  const showBudget = draft.enquiryType !== "collaborate";
  const referencesExisting = IMPLIES_EXISTING.has(draft.projectStage ?? "");
  const contextLabel = referencesExisting
    ? "What's not working with it right now?"
    : "Anything else you'd like us to know?";
  const contextPlaceholder = referencesExisting
    ? "A sentence or two on what's not working is enough."
    : "A sentence or two is enough.";

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h2 className="secondary-title intake-question-title">Is there a timeline?</h2>
        <div
          className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
          role="radiogroup"
          aria-label="Is there a timeline?"
        >
          {timelineOptions.map((option) => (
            <OptionRow
              key={option.value}
              type="radio"
              name="timeline"
              value={option.value}
              label={option.label}
              checked={draft.timeline === option.value}
              onChange={() => update({ timeline: option.value })}
            />
          ))}
        </div>
        {errors.timeline ? (
          <p className="field-error" role="alert">
            {errors.timeline}
          </p>
        ) : null}
      </div>

      {showBudget ? (
        <div>
          <h2 className="font-display text-2xl md:text-[1.75rem]">
            Do you have a working budget?{" "}
            <span className="text-base font-normal text-muted">(optional)</span>
          </h2>
          <div
            className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
            role="radiogroup"
            aria-label="Do you have a working budget?"
          >
            {budgetOptions.map((option) => (
              <OptionRow
                key={option.value}
                type="radio"
                name="budget"
                value={option.value}
                label={option.label}
                checked={draft.budget === option.value}
                onChange={() => update({ budget: option.value })}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="border-t border-line pt-10">
        <h2 className="font-display text-2xl md:text-[1.75rem]">Your contact details</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
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
              Phone / WhatsApp <span className="font-normal text-muted">(optional)</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              autoComplete="tel"
              className="field-input"
              value={draft.phone ?? ""}
              onChange={(event) => update({ phone: event.target.value })}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="contact-org">
              Organisation / business name <span className="font-normal text-muted">(optional)</span>
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
        </div>

        <div className="mt-6">
          <label className="field-label" htmlFor="additional-context">
            {contextLabel} <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="additional-context"
            className="field-textarea"
            style={{ minHeight: "5rem" }}
            placeholder={contextPlaceholder}
            maxLength={600}
            value={draft.additionalContext ?? ""}
            onChange={(event) => update({ additionalContext: event.target.value })}
          />
          <p className="field-help">Optional. A sentence or two is enough.</p>
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

        <p className="field-help mt-6 max-w-xl">
          By sending this, you&apos;re sharing project information with AiForm Studio so I can
          respond to your enquiry. Please don&apos;t include passwords or other sensitive
          credentials.
        </p>
      </div>
    </div>
  );
}
