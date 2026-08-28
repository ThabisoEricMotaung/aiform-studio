import type { Draft } from "./types";

export const TOTAL_STEPS = 6;

export function validateStep(step: number, draft: Draft): Record<string, string> {
  const errors: Record<string, string> = {};

  switch (step) {
    case 0: {
      if (!draft.enquiryType) {
        errors.enquiryType = "Please choose the closest fit.";
      }
      break;
    }
    case 1: {
      if (!draft.currentProblems?.length) {
        errors.currentProblems = "Pick anything that sounds familiar.";
      }
      break;
    }
    case 2: {
      if (!draft.audiences?.length) {
        errors.audiences = "Choose at least one — 'Not sure yet' is a valid answer.";
      }
      break;
    }
    case 3: {
      if (!draft.desiredOutcomes?.length) {
        errors.desiredOutcomes = "Choose the outcomes that matter most — it's fine to pick just one.";
      }
      break;
    }
    case 4: {
      if (!draft.projectStage) {
        errors.projectStage = "Please choose where things stand today.";
      }
      break;
    }
    case 5: {
      if (!draft.timeline) {
        errors.timeline = "Please pick the option closest to your situation.";
      }
      if (!draft.name?.trim()) {
        errors.name = "Please let me know your name.";
      }
      const email = draft.email?.trim() ?? "";
      if (!email) {
        errors.email = "Please add an email address.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "That email doesn't look right.";
      }
      break;
    }
    default:
      break;
  }

  return errors;
}

export function stepForField(field: string): number {
  const map: Record<string, number> = {
    enquiryType: 0,
    currentProblems: 1,
    otherProblemNote: 1,
    audiences: 2,
    desiredOutcomes: 3,
    projectStage: 4,
    timeline: 5,
    budget: 5,
    additionalContext: 5,
    name: 5,
    email: 5,
    phone: 5,
    organisation: 5,
  };
  return map[field] ?? 0;
}
