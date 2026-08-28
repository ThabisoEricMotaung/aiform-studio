"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import type { Draft, StepProps } from "./types";
import { validateStep, stepForField, TOTAL_STEPS } from "./validation";
import ProgressBar from "./ProgressBar";
import ReviewPanel from "./ReviewPanel";
import Confirmation from "./Confirmation";
import Step1BringsYouHere from "./steps/Step1BringsYouHere";
import Step2CurrentSituation from "./steps/Step2CurrentSituation";
import Step3Audience from "./steps/Step3Audience";
import Step4Outcomes from "./steps/Step4Outcomes";
import Step5Stage from "./steps/Step5Stage";
import Step6Practical from "./steps/Step6Practical";

const STORAGE_KEY = "aiform-intake-draft-v2";
const AUTO_ADVANCE_DELAY_MS = 200;

const STEPS: ComponentType<StepProps>[] = [
  Step1BringsYouHere,
  Step2CurrentSituation,
  Step3Audience,
  Step4Outcomes,
  Step5Stage,
  Step6Practical,
];

// Steps whose question has one mutually-exclusive answer auto-advance
// instead of waiting for a Continue click. Steps with genuine multi-select
// questions (or a mix of question types, like the final practical/contact
// step) keep Continue, since nothing else signals "I'm done choosing."
const AUTO_ADVANCE_STEPS = new Set([0, 4]);

export default function IntakeForm() {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const autoAdvanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelAutoAdvance = () => {
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }
  };

  useEffect(() => cancelAutoAdvance, []);

  useEffect(() => {
    let restored: Draft = {};
    let restoredStep = 0;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { draft?: Draft; step?: number };
        restored = saved.draft ?? {};
        restoredStep = saved.step ?? 0;
      }
    } catch {
      // Storage may be unavailable (private mode, quota) — start fresh.
    }
    // One-time sync from sessionStorage on mount, gated behind `hydrated` so
    // the server-rendered markup never has to guess at browser-only state
    // (the same pattern libraries like next-themes use to avoid a hydration
    // mismatch). A lazy useState initializer would run during the
    // hydration render itself and reintroduce that mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft({ ...restored, startedAt: restored.startedAt ?? Date.now() });
    setStep(restoredStep);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ draft, step }));
    } catch {
      // Draft still lives in memory even if it can't persist.
    }
  }, [draft, step, hydrated]);

  useEffect(() => {
    panelRef.current?.focus();
  }, [step, reviewing, submitted]);

  const update = (patch: Draft) => {
    setDraft((prev) => ({ ...prev, ...patch }));
    setErrors({});
  };

  // For single-select, mutually-exclusive questions: the checked style
  // shows the instant the input's native `checked` state changes (pure CSS,
  // independent of this re-render), then this waits briefly so the
  // selection reads as acknowledged before moving on.
  const selectAndAdvance = (patch: Draft) => {
    setDraft((prev) => ({ ...prev, ...patch }));
    setErrors({});
    cancelAutoAdvance();
    autoAdvanceTimeout.current = setTimeout(() => {
      setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
    }, AUTO_ADVANCE_DELAY_MS);
  };

  const goNext = () => {
    cancelAutoAdvance();
    const stepErrors = validateStep(step, draft);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (step === TOTAL_STEPS - 1) {
      setReviewing(true);
    } else {
      setStep((current) => current + 1);
    }
  };

  const goBack = () => {
    cancelAutoAdvance();
    if (reviewing) {
      setReviewing(false);
      return;
    }
    setErrors({});
    setStep((current) => Math.max(0, current - 1));
  };

  const editStep = (targetStep: number) => {
    cancelAutoAdvance();
    setReviewing(false);
    setStep(targetStep);
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
          const firstField = Object.keys(result.fieldErrors)[0];
          if (firstField) {
            setReviewing(false);
            setStep(stepForField(firstField));
          }
        }
        setSubmitError(
          result.error ||
            "I couldn't send that yet. Your answers haven't been lost. Please try again.",
        );
        return;
      }

      setSubmitted(true);
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing else to clean up if storage isn't available.
      }
    } catch {
      setSubmitError("I couldn't send that yet. Your answers haven't been lost. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return <div className="intake-panel" style={{ minHeight: "28rem" }} aria-hidden="true" />;
  }

  if (submitted) {
    return <Confirmation />;
  }

  const StepComponent = STEPS[step];
  const isAutoAdvanceStep = !reviewing && AUTO_ADVANCE_STEPS.has(step);

  return (
    <div className="intake-panel">
      {!reviewing ? <ProgressBar step={step} total={TOTAL_STEPS} /> : null}

      <div ref={panelRef} tabIndex={-1} className="mt-8 outline-none">
        {reviewing ? (
          <ReviewPanel draft={draft} onEdit={editStep} />
        ) : (
          <StepComponent
            draft={draft}
            errors={errors}
            update={update}
            selectAndAdvance={selectAndAdvance}
          />
        )}
      </div>

      {submitError ? (
        <p className="field-error mt-6" role="alert">
          {submitError}
        </p>
      ) : null}

      {reviewing && !submitError ? (
        <p className="field-help mt-6">No polished proposal needed. We&apos;ll start with the problem.</p>
      ) : null}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0 && !reviewing}
          className="min-h-11 text-sm font-medium text-muted transition-colors hover:text-green disabled:pointer-events-none disabled:opacity-0"
        >
          ← Back
        </button>
        {reviewing ? (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="font-display min-h-11 rounded-md bg-green px-6 py-3 text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send project brief →"}
          </button>
        ) : isAutoAdvanceStep ? null : (
          <button
            type="button"
            onClick={goNext}
            className="font-display min-h-11 rounded-md bg-green px-6 py-3 text-sm text-white transition-opacity hover:opacity-90"
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
