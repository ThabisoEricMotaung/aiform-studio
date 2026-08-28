import {
  enquiryTypeOptions,
  currentProblemOptions,
  audienceOptions,
  desiredOutcomeOptions,
  projectStageOptions,
  timelineOptions,
  budgetOptions,
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
  const problemLines = (draft.currentProblems ?? []).map((value) =>
    value === "other" && draft.otherProblemNote
      ? `Something else: ${draft.otherProblemNote}`
      : labelFor(currentProblemOptions, value),
  );

  const rows: Row[] = [
    { label: "Looking for", value: labelFor(enquiryTypeOptions, draft.enquiryType), editStep: 0 },
    { label: "Current problem", value: problemLines.join("\n") || "—", editStep: 1 },
    {
      label: "For",
      value: (draft.audiences ?? []).map((v) => labelFor(audienceOptions, v)).join(", ") || "—",
      editStep: 2,
    },
    {
      label: "Desired outcome",
      value: (draft.desiredOutcomes ?? []).map((v) => labelFor(desiredOutcomeOptions, v)).join("\n") || "—",
      editStep: 3,
    },
    { label: "Current stage", value: labelFor(projectStageOptions, draft.projectStage), editStep: 4 },
    ...(draft.additionalContext
      ? [{ label: "Additional context", value: `"${draft.additionalContext}"`, editStep: 4 }]
      : []),
    { label: "Timeline", value: labelFor(timelineOptions, draft.timeline) || "—", editStep: 5 },
    ...(draft.budget ? [{ label: "Budget", value: labelFor(budgetOptions, draft.budget), editStep: 5 }] : []),
    { label: "Name", value: draft.name ?? "", editStep: 5 },
    { label: "Email", value: draft.email ?? "", editStep: 5 },
    ...(draft.phone ? [{ label: "Phone / WhatsApp", value: draft.phone, editStep: 5 }] : []),
    ...(draft.organisation ? [{ label: "Organisation", value: draft.organisation, editStep: 5 }] : []),
  ];

  return (
    <div>
      <p className="chapter-label uppercase">Your brief</p>
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
