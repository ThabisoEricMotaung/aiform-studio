import { enquiryTypeOptions } from "@/lib/inquiry";
import OptionRow from "../OptionRow";
import type { StepProps } from "../types";

export default function Step1BringsYouHere({ draft, errors, selectAndAdvance }: StepProps) {
  return (
    <div>
      <h2 className="secondary-title">What brings you here?</h2>
      <p className="field-help mt-3 max-w-2xl text-[0.95rem]">
        Choose the closest fit. It doesn&apos;t have to be exact.
      </p>
      <div
        className="mt-8 grid gap-3 sm:grid-cols-2"
        role="radiogroup"
        aria-label="What brings you here?"
      >
        {enquiryTypeOptions.map((option) => (
          <OptionRow
            key={option.value}
            type="radio"
            name="enquiryType"
            value={option.value}
            label={option.label}
            checked={draft.enquiryType === option.value}
            onChange={() => selectAndAdvance({ enquiryType: option.value })}
          />
        ))}
      </div>
      {errors.enquiryType ? (
        <p className="field-error" role="alert">
          {errors.enquiryType}
        </p>
      ) : null}
    </div>
  );
}
