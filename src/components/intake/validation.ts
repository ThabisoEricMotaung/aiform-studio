import type { Draft } from "./types";

export const TOTAL_STEPS = 6;

export function validateStep(step: number, draft: Draft): Record<string, string> {
  const errors: Record<string, string> = {};

  switch (step) {
    case 0: {
      if (!draft.inquiryType) {
        errors.inquiryType = "Please choose one of the options above.";
      }
      break;
    }
    case 1: {
      const problem = draft.problemDescription?.trim() ?? "";
      const project = draft.projectDescription?.trim() ?? "";
      if (draft.inquiryType === "problem" && problem.length < 30) {
        errors.problemDescription =
          "A few more sentences would help me understand what's going on.";
      } else if (draft.inquiryType === "project" && project.length < 30) {
        errors.projectDescription = "Tell me a little more about what you're hoping to build.";
      } else if (draft.inquiryType === "improve" && problem.length < 20) {
        errors.problemDescription = "Tell me what exists today and what's frustrating about it.";
      } else if (draft.inquiryType === "collaborate") {
        if (!draft.collaborationType?.length) {
          errors.collaborationType = "Pick at least one area.";
        }
        if (project.length < 10) {
          errors.projectDescription = "Tell me a little about the collaboration you have in mind.";
        }
      } else if (draft.inquiryType === "unsure" && problem.length < 10) {
        errors.problemDescription = "Just a sentence or two about what's on your mind is enough.";
      }
      break;
    }
    case 2: {
      if ((draft.desiredOutcome?.trim().length ?? 0) < 10) {
        errors.desiredOutcome = "Please add a short line about what better would look like.";
      }
      break;
    }
    case 3: {
      if (!draft.currentStage) {
        errors.currentStage = "Please choose where things stand today.";
      }
      break;
    }
    case 4: {
      if (!draft.helpTypes?.length) {
        errors.helpTypes = "Choose at least one — 'Not sure' is a valid answer.";
      }
      if (!draft.timing) {
        errors.timing = "Please pick the option closest to your situation.";
      }
      break;
    }
    case 5: {
      if (!draft.name?.trim()) {
        errors.name = "Please let me know your name.";
      }
      const email = draft.email?.trim() ?? "";
      if (!email) {
        errors.email = "Please add an email address.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "That email doesn't look right.";
      }
      if (
        (draft.preferredContact === "whatsapp" || draft.preferredContact === "call") &&
        !draft.phone?.trim()
      ) {
        errors.phone = "Please add a number so I can reach you that way.";
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
    inquiryType: 0,
    problemDescription: 1,
    projectDescription: 1,
    collaborationType: 1,
    desiredOutcome: 2,
    currentStage: 3,
    existingUrl: 3,
    currentStateNote: 3,
    helpTypes: 4,
    timing: 4,
    budgetRange: 4,
    referenceNotes: 4,
    name: 5,
    email: 5,
    phone: 5,
  };
  return map[field] ?? 0;
}
