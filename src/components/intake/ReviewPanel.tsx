import {
  inquiryTypeOptions,
  collaborationTypeOptions,
  currentStageOptions,
  helpTypeOptions,
  timingOptions,
  budgetRangeOptions,
  preferredContactOptions,
  labelFor,
} from "@/lib/inquiry";
import type { Draft } from "./types";

type Row = { label: string; value: string; editStep: number };

export default function ReviewPanel({
  draft,
  onEdit,
}: {
  draft: Draft;
  onEdit: (step: number) => void;
}) {
  const type = draft.inquiryType;
  const situation =
    type === "project" || type === "collaborate" ? draft.projectDescription : draft.problemDescription;

  const rows: Row[] = [
    { label: "You're asking about", value: labelFor(inquiryTypeOptions, type), editStep: 0 },
    ...(type === "collaborate" && draft.collaborationType?.length
      ? [
          {
            label: "Collaboration areas",
            value: draft.collaborationType.map((v) => labelFor(collaborationTypeOptions, v)).join(" · "),
            editStep: 1,
          },
        ]
      : []),
    { label: "Current situation", value: situation ?? "", editStep: 1 },
    { label: "Desired outcome", value: draft.desiredOutcome ?? "", editStep: 2 },
    { label: "Where things stand", value: labelFor(currentStageOptions, draft.currentStage), editStep: 3 },
    ...(draft.existingUrl ? [{ label: "Link shared", value: draft.existingUrl, editStep: 3 }] : []),
    {
      label: "Help requested",
      value: (draft.helpTypes ?? []).map((v) => labelFor(helpTypeOptions, v)).join(" · ") || "—",
      editStep: 4,
    },
    { label: "Timing", value: labelFor(timingOptions, draft.timing) || "—", editStep: 4 },
    ...(draft.budgetRange
      ? [{ label: "Budget range", value: labelFor(budgetRangeOptions, draft.budgetRange), editStep: 4 }]
      : []),
    { label: "Name", value: draft.name ?? "", editStep: 5 },
    { label: "Email", value: draft.email ?? "", editStep: 5 },
    ...(draft.phone ? [{ label: "Phone / WhatsApp", value: draft.phone, editStep: 5 }] : []),
    ...(draft.preferredContact
      ? [{ label: "Preferred contact", value: labelFor(preferredContactOptions, draft.preferredContact), editStep: 5 }]
      : []),
  ];

  return (
    <div>
      <p className="chapter-label">Review</p>
      <h2 id="review-heading" className="secondary-title mt-4">
        Here&apos;s what I&apos;ve got.
      </h2>
      <div className="mt-8">
        {rows.map((row) => (
          <div key={row.label} className="review-row">
            <div>
              <p className="chapter-label uppercase">{row.label}</p>
              <p className="review-row-value">{row.value || "—"}</p>
            </div>
            <button
              type="button"
              className="review-edit"
              onClick={() => onEdit(row.editStep)}
              aria-label={`Edit ${row.label}`}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
