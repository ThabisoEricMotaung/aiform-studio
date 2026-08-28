import { projectStageOptions } from "@/lib/inquiry";
import OptionRow from "../OptionRow";
import type { StepProps } from "../types";

// Once someone has told us "we don't have anything yet", stages that imply
// something already exists no longer apply — asking about fixing or
// improving a system that was just ruled out reads as not having listened.
const IMPLIES_EXISTING = new Set(["existing_system", "already_built", "needs_fixing"]);

export default function Step5Stage({ draft, errors, selectAndAdvance }: StepProps) {
  const hasNothingYet = draft.currentProblems?.includes("nothing_yet") ?? false;
  const options = hasNothingYet
    ? projectStageOptions.filter((option) => !IMPLIES_EXISTING.has(option.value))
    : projectStageOptions;

  return (
    <div>
      <h2 className="secondary-title intake-question-title">Where are you currently?</h2>
      <div
        className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
        role="radiogroup"
        aria-label="Where are you currently?"
      >
        {options.map((option) => (
          <OptionRow
            key={option.value}
            type="radio"
            name="projectStage"
            value={option.value}
            label={option.label}
            checked={draft.projectStage === option.value}
            onChange={() => selectAndAdvance({ projectStage: option.value })}
          />
        ))}
      </div>
      {errors.projectStage ? (
        <p className="field-error" role="alert">
          {errors.projectStage}
        </p>
      ) : null}
    </div>
  );
}
