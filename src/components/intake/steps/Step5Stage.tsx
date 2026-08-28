import { projectStageOptions } from "@/lib/inquiry";
import OptionRow from "../OptionRow";
import type { StepProps } from "../types";

export default function Step5Stage({ draft, errors, selectAndAdvance }: StepProps) {
  return (
    <div>
      <h2 className="secondary-title">Where are you currently?</h2>
      <div
        className="mt-8 grid gap-3 sm:grid-cols-2"
        role="radiogroup"
        aria-label="Where are you currently?"
      >
        {projectStageOptions.map((option) => (
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
