import { audienceOptions } from "@/lib/inquiry";
import OptionRow from "../OptionRow";
import type { StepProps } from "../types";

export default function Step3Audience({ draft, errors, update }: StepProps) {
  const selected = draft.audiences ?? [];

  const toggle = (value: (typeof audienceOptions)[number]["value"], checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(value);
    else next.delete(value);
    update({ audiences: Array.from(next) });
  };

  return (
    <div>
      <h2 className="secondary-title">Who is this mainly for?</h2>
      <div
        className="mt-8 grid gap-3 sm:grid-cols-2"
        role="group"
        aria-label="Who is this mainly for?"
      >
        {audienceOptions.map((option) => (
          <OptionRow
            key={option.value}
            type="checkbox"
            name="audiences"
            value={option.value}
            label={option.label}
            checked={selected.includes(option.value)}
            onChange={(checked) => toggle(option.value, checked)}
          />
        ))}
      </div>
      {errors.audiences ? (
        <p className="field-error" role="alert">
          {errors.audiences}
        </p>
      ) : null}
    </div>
  );
}
