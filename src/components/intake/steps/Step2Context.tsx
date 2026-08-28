import { collaborationTypeOptions, type InquiryType } from "@/lib/inquiry";
import OptionRow from "../OptionRow";
import type { StepProps } from "../types";

const COPY: Record<InquiryType, { heading: string; helper: string; placeholder: string }> = {
  problem: {
    heading:
      "What's currently difficult, slow, repetitive, confusing or not working as well as it should?",
    helper: "Describe the situation in your own words. You don't need to propose a solution.",
    placeholder:
      "What is currently difficult, slow, repetitive, expensive, confusing or not working the way you need it to?",
  },
  project: {
    heading: "What are you hoping to build?",
    helper: "Tell us what you want the project to do, who it is for and why it matters.",
    placeholder: "What should this do, who is it for, and why does it matter?",
  },
  improve: {
    heading: "What already exists, and what frustrates you most about it?",
    helper: "A few sentences are enough. The goal is context, not a technical brief.",
    placeholder: "What's in place today, and what frustrates you most about it?",
  },
  collaborate: {
    heading: "What would you like to collaborate on?",
    helper: "Tell us a little about the collaboration you have in mind.",
    placeholder: "What are you hoping this collaboration looks like?",
  },
  unsure: {
    heading: "What's happening that made you start looking for help?",
    helper: "There's no wrong answer here — just tell me what's on your mind.",
    placeholder: "What's going on? A sentence or two is plenty to start.",
  },
};

export default function Step2Context({ draft, errors, update }: StepProps) {
  const type = (draft.inquiryType ?? "unsure") as InquiryType;
  const copy = COPY[type] ?? COPY.unsure;
  const usesProjectField = type === "project" || type === "collaborate";
  const value = usesProjectField ? draft.projectDescription ?? "" : draft.problemDescription ?? "";
  const error = usesProjectField ? errors.projectDescription : errors.problemDescription;

  return (
    <div>
      <h2 id="step2-heading" className="secondary-title">
        {copy.heading}
      </h2>
      <p className="field-help mt-3 max-w-2xl text-[0.95rem]">{copy.helper}</p>

      {type === "collaborate" ? (
        <div className="mt-8">
          <span className="field-label">Areas of interest</span>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Areas of interest">
            {collaborationTypeOptions.map((option) => {
              const selected = draft.collaborationType?.includes(option.value) ?? false;
              return (
                <OptionRow
                  key={option.value}
                  type="checkbox"
                  name="collaborationType"
                  value={option.value}
                  label={option.label}
                  checked={selected}
                  onChange={(checked) => {
                    const next = new Set(draft.collaborationType ?? []);
                    if (checked) next.add(option.value);
                    else next.delete(option.value);
                    update({ collaborationType: Array.from(next) });
                  }}
                />
              );
            })}
          </div>
          {errors.collaborationType ? (
            <p className="field-error" role="alert">
              {errors.collaborationType}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8">
        <textarea
          aria-labelledby="step2-heading"
          className="field-textarea"
          placeholder={copy.placeholder}
          aria-invalid={Boolean(error)}
          value={value}
          onChange={(event) =>
            usesProjectField
              ? update({ projectDescription: event.target.value })
              : update({ problemDescription: event.target.value })
          }
        />
        {error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {type === "improve" ? (
        <div className="mt-8">
          <label className="field-label" htmlFor="existingUrl">
            Current website/system URL <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="existingUrl"
            type="url"
            className="field-input"
            placeholder="https://"
            value={draft.existingUrl ?? ""}
            onChange={(event) => update({ existingUrl: event.target.value })}
          />
        </div>
      ) : null}
    </div>
  );
}
