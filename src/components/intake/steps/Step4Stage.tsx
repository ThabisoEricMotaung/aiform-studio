import { currentStageOptions } from "@/lib/inquiry";
import OptionRow from "../OptionRow";
import type { StepProps } from "../types";

export default function Step4Stage({ draft, errors, update }: StepProps) {
  return (
    <div>
      <h2 className="secondary-title">Where are you now?</h2>
      <div className="mt-8 flex flex-col gap-3" role="radiogroup" aria-label="Where are you now?">
        {currentStageOptions.map((option) => (
          <OptionRow
            key={option.value}
            type="radio"
            name="currentStage"
            value={option.value}
            label={option.label}
            checked={draft.currentStage === option.value}
            onChange={() => update({ currentStage: option.value })}
          />
        ))}
      </div>
      {errors.currentStage ? (
        <p className="field-error" role="alert">
          {errors.currentStage}
        </p>
      ) : null}

      {draft.currentStage === "existing_system" ? (
        <div className="mt-8">
          <label className="field-label" htmlFor="stage-existing-url">
            Website or system URL <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="stage-existing-url"
            type="url"
            className="field-input"
            placeholder="https://"
            value={draft.existingUrl ?? ""}
            onChange={(event) => update({ existingUrl: event.target.value })}
          />
        </div>
      ) : null}

      {draft.currentStage === "building" ? (
        <div className="mt-8 flex flex-col gap-6">
          <div>
            <label className="field-label" htmlFor="stage-building-url">
              Project URL (repo, staging, or live link){" "}
              <span className="font-normal text-muted">(optional)</span>
            </label>
            <input
              id="stage-building-url"
              type="url"
              className="field-input"
              placeholder="https://"
              value={draft.existingUrl ?? ""}
              onChange={(event) => update({ existingUrl: event.target.value })}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="stage-building-note">
              A short note on where it&apos;s at{" "}
              <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="stage-building-note"
              className="field-textarea"
              style={{ minHeight: "6rem" }}
              value={draft.currentStateNote ?? ""}
              onChange={(event) => update({ currentStateNote: event.target.value })}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
