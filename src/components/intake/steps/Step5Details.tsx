import { helpTypeOptions, timingOptions, budgetRangeOptions } from "@/lib/inquiry";
import OptionRow from "../OptionRow";
import type { StepProps } from "../types";

export default function Step5Details({ draft, errors, update }: StepProps) {
  const showBudget = draft.inquiryType !== "collaborate";

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h2 className="secondary-title">What kind of help do you think you need?</h2>
        <p className="field-help mt-3 max-w-2xl text-[0.95rem]">
          Choose as many as apply. &quot;Not sure&quot; is a valid answer.
        </p>
        <div
          className="mt-8 grid gap-3 sm:grid-cols-2"
          role="group"
          aria-label="What kind of help do you think you need?"
        >
          {helpTypeOptions.map((option) => {
            const selected = draft.helpTypes?.includes(option.value) ?? false;
            return (
              <OptionRow
                key={option.value}
                type="checkbox"
                name="helpTypes"
                value={option.value}
                label={option.label}
                checked={selected}
                onChange={(checked) => {
                  const next = new Set(draft.helpTypes ?? []);
                  if (checked) next.add(option.value);
                  else next.delete(option.value);
                  update({ helpTypes: Array.from(next) });
                }}
              />
            );
          })}
        </div>
        {errors.helpTypes ? (
          <p className="field-error" role="alert">
            {errors.helpTypes}
          </p>
        ) : null}
      </div>

      <div>
        <label className="field-label" htmlFor="reference-notes">
          Anything I should look at? <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="reference-notes"
          className="field-textarea"
          style={{ minHeight: "6rem" }}
          placeholder="A website, a competitor, a document, a repo — whatever helps explain the context."
          value={draft.referenceNotes ?? ""}
          onChange={(event) => update({ referenceNotes: event.target.value })}
        />
        <p className="field-help">Optional. Share anything that helps explain the context.</p>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-[1.75rem]">Is there a timing constraint?</h2>
        <div
          className="mt-6 flex flex-col gap-3"
          role="radiogroup"
          aria-label="Is there a timing constraint?"
        >
          {timingOptions.map((option) => (
            <OptionRow
              key={option.value}
              type="radio"
              name="timing"
              value={option.value}
              label={option.label}
              checked={draft.timing === option.value}
              onChange={() => update({ timing: option.value })}
            />
          ))}
        </div>
        {errors.timing ? (
          <p className="field-error" role="alert">
            {errors.timing}
          </p>
        ) : null}
      </div>

      {showBudget ? (
        <div>
          <h2 className="font-display text-2xl md:text-[1.75rem]">
            Do you have a working budget range?{" "}
            <span className="text-base font-normal text-muted">(optional)</span>
          </h2>
          <div
            className="mt-6 flex flex-col gap-3"
            role="radiogroup"
            aria-label="Do you have a working budget range?"
          >
            {budgetRangeOptions.map((option) => (
              <OptionRow
                key={option.value}
                type="radio"
                name="budgetRange"
                value={option.value}
                label={option.label}
                checked={draft.budgetRange === option.value}
                onChange={() => update({ budgetRange: option.value })}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
