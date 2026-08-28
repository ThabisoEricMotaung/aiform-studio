import { currentProblemOptions, isRecommendedProblem } from "@/lib/inquiry";
import OptionRow from "../OptionRow";
import SelectionMeta from "../SelectionMeta";
import type { StepProps } from "../types";
import {
  IconRepeat,
  IconScattered,
  IconTable,
  IconPersonAlert,
  IconBroken,
  IconEmptyBox,
  IconClock,
  IconVerify,
  IconOther,
} from "../icons";

const ICONS: Record<string, React.ReactNode> = {
  manual_work: <IconRepeat />,
  scattered_info: <IconScattered />,
  spreadsheets_whatsapp: <IconTable />,
  customer_struggle: <IconPersonAlert />,
  system_not_working: <IconBroken />,
  nothing_yet: <IconEmptyBox />,
  time_consuming: <IconClock />,
  hard_to_track: <IconVerify />,
  other: <IconOther />,
};

export default function Step2CurrentSituation({ draft, errors, update }: StepProps) {
  const selected = draft.currentProblems ?? [];
  const showOtherNote = selected.includes("other");

  const toggle = (value: (typeof currentProblemOptions)[number]["value"], checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(value);
    else next.delete(value);
    update({ currentProblems: Array.from(next) });
  };

  return (
    <div>
      <h2 className="secondary-title intake-question-title">What&apos;s happening right now?</h2>
      <p className="field-help mt-3 max-w-2xl text-[0.95rem]">
        Select anything that sounds familiar.
      </p>
      <SelectionMeta count={selected.length} />
      <div
        className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
        role="group"
        aria-label="What's happening right now?"
      >
        {currentProblemOptions.map((option) => (
          <OptionRow
            key={option.value}
            type="checkbox"
            name="currentProblems"
            value={option.value}
            label={option.label}
            icon={ICONS[option.value]}
            hint={isRecommendedProblem(draft.enquiryType, option.value) ? "Likely relevant" : undefined}
            checked={selected.includes(option.value)}
            onChange={(checked) => toggle(option.value, checked)}
          />
        ))}
      </div>
      {errors.currentProblems ? (
        <p className="field-error" role="alert">
          {errors.currentProblems}
        </p>
      ) : null}

      {showOtherNote ? (
        <div className="mt-6">
          <label className="field-label" htmlFor="other-problem-note">
            Tell us briefly <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="other-problem-note"
            type="text"
            className="field-input"
            placeholder="What's going on?"
            value={draft.otherProblemNote ?? ""}
            onChange={(event) => update({ otherProblemNote: event.target.value })}
          />
        </div>
      ) : null}
    </div>
  );
}
