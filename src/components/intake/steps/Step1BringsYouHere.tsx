import { inquiryTypeOptions } from "@/lib/inquiry";
import OptionRow from "../OptionRow";
import type { StepProps } from "../types";

export default function Step1BringsYouHere({ draft, errors, update }: StepProps) {
  return (
    <div>
      <h2 className="secondary-title">What brings you here?</h2>
      <div className="mt-8 flex flex-col gap-3" role="radiogroup" aria-label="What brings you here?">
        {inquiryTypeOptions.map((option) => (
          <OptionRow
            key={option.value}
            type="radio"
            name="inquiryType"
            value={option.value}
            label={option.label}
            checked={draft.inquiryType === option.value}
            onChange={() => update({ inquiryType: option.value })}
          />
        ))}
      </div>
      {errors.inquiryType ? (
        <p className="field-error" role="alert">
          {errors.inquiryType}
        </p>
      ) : null}
    </div>
  );
}
