import type { StepProps } from "../types";

export default function Step3Outcome({ draft, errors, update }: StepProps) {
  return (
    <div>
      <h2 id="step3-heading" className="secondary-title">
        What would a better outcome look like?
      </h2>
      <p className="field-help mt-3 max-w-2xl text-[0.95rem]">
        If this worked properly, what would change for you, your team or your customers?
      </p>
      <div className="mt-8">
        <textarea
          aria-labelledby="step3-heading"
          className="field-textarea"
          placeholder="What would change for you, your team or your customers?"
          aria-invalid={Boolean(errors.desiredOutcome)}
          value={draft.desiredOutcome ?? ""}
          onChange={(event) => update({ desiredOutcome: event.target.value })}
        />
        {errors.desiredOutcome ? (
          <p className="field-error" role="alert">
            {errors.desiredOutcome}
          </p>
        ) : null}
      </div>
    </div>
  );
}
