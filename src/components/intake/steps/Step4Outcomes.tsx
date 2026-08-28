import { desiredOutcomeOptions } from "@/lib/inquiry";
import OptionRow from "../OptionRow";
import type { StepProps } from "../types";

export default function Step4Outcomes({ draft, errors, update }: StepProps) {
  const selected = draft.desiredOutcomes ?? [];

  const toggle = (value: (typeof desiredOutcomeOptions)[number]["value"], checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(value);
    else next.delete(value);
    update({ desiredOutcomes: Array.from(next) });
  };

  return (
    <div>
      <h2 className="secondary-title">What would make this successful?</h2>
      <p className="field-help mt-3 max-w-2xl text-[0.95rem]">Choose the outcomes that matter most.</p>
      <div
        className="mt-8 grid gap-3 sm:grid-cols-2"
        role="group"
        aria-label="What would make this successful?"
      >
        {desiredOutcomeOptions.map((option) => (
          <OptionRow
            key={option.value}
            type="checkbox"
            name="desiredOutcomes"
            value={option.value}
            label={option.label}
            checked={selected.includes(option.value)}
            onChange={(checked) => toggle(option.value, checked)}
          />
        ))}
      </div>
      {errors.desiredOutcomes ? (
        <p className="field-error" role="alert">
          {errors.desiredOutcomes}
        </p>
      ) : null}
    </div>
  );
}
