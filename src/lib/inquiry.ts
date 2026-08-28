import { z } from "zod";

export const enquiryTypeOptions = [
  { value: "website", label: "I need a website" },
  { value: "system", label: "I need a system or tool" },
  { value: "process_problem", label: "I have a process problem" },
  { value: "automation", label: "I want to automate something" },
  { value: "improve_existing", label: "I want to improve something existing" },
  { value: "idea", label: "I have an idea I'm exploring" },
  { value: "collaborate", label: "I want to collaborate" },
  { value: "unsure", label: "I'm not sure yet" },
] as const;

export const currentProblemOptions = [
  { value: "manual_work", label: "Too much manual work" },
  { value: "scattered_info", label: "Information is scattered" },
  { value: "spreadsheets_whatsapp", label: "We're using spreadsheets / WhatsApp" },
  { value: "customer_struggle", label: "Customers struggle with something" },
  { value: "system_not_working", label: "Our current system isn't working" },
  { value: "nothing_yet", label: "We don't have anything yet" },
  { value: "time_consuming", label: "Something takes too much time" },
  { value: "hard_to_track", label: "Something is difficult to track or verify" },
  { value: "other", label: "Something else" },
] as const;

export const audienceOptions = [
  { value: "business", label: "My business" },
  { value: "team", label: "My team" },
  { value: "customers", label: "My customers" },
  { value: "students", label: "Students / learners" },
  { value: "suppliers", label: "Suppliers" },
  { value: "members", label: "Members / users" },
  { value: "public", label: "The public" },
  { value: "other", label: "Other" },
  { value: "not_sure", label: "Not sure yet" },
] as const;

export const desiredOutcomeOptions = [
  { value: "save_time", label: "Save time" },
  { value: "reduce_admin", label: "Reduce admin" },
  { value: "sales_leads", label: "Generate sales or leads" },
  { value: "organise_info", label: "Organise information" },
  { value: "customer_experience", label: "Improve customer experience" },
  { value: "automate_repetitive", label: "Automate repetitive work" },
  { value: "track_verify", label: "Track or verify something" },
  { value: "findable_info", label: "Make information easier to find" },
  { value: "launch_idea", label: "Launch a new idea" },
  { value: "replace_process", label: "Replace an existing process" },
  { value: "still_figuring_out", label: "I'm still figuring that out" },
] as const;

export const projectStageOptions = [
  { value: "idea", label: "It's just an idea" },
  { value: "planning", label: "I'm planning it" },
  { value: "manual", label: "We're already doing this manually" },
  { value: "existing_system", label: "We have an existing website/system" },
  { value: "already_built", label: "Something has already been built" },
  { value: "needs_fixing", label: "We need help fixing or improving something" },
  { value: "not_sure", label: "Not sure" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1_month", label: "Within 1 month" },
  { value: "1_3_months", label: "1–3 months" },
  { value: "3_plus_months", label: "3+ months" },
  { value: "flexible", label: "Flexible / not sure" },
] as const;

export const budgetOptions = [
  { value: "exploring", label: "I'm exploring costs" },
  { value: "under_10k", label: "Under R10,000" },
  { value: "10k_30k", label: "R10,000–R30,000" },
  { value: "30k_75k", label: "R30,000–R75,000" },
  { value: "75k_plus", label: "R75,000+" },
  { value: "not_sure", label: "Not sure yet" },
] as const;

type OptionValue<T extends readonly { value: string }[]> = T[number]["value"];

export type EnquiryType = OptionValue<typeof enquiryTypeOptions>;
export type CurrentProblem = OptionValue<typeof currentProblemOptions>;
export type Audience = OptionValue<typeof audienceOptions>;
export type DesiredOutcome = OptionValue<typeof desiredOutcomeOptions>;
export type ProjectStage = OptionValue<typeof projectStageOptions>;
export type Timeline = OptionValue<typeof timelineOptions>;
export type Budget = OptionValue<typeof budgetOptions>;

export function labelFor<T extends readonly { value: string; label: string }[]>(
  options: T,
  value: string | undefined | null,
): string {
  if (!value) return "";
  return options.find((option) => option.value === value)?.label ?? value;
}

const optionValues = <T extends readonly { value: string }[]>(options: T) =>
  options.map((option) => option.value) as unknown as [
    T[number]["value"],
    ...T[number]["value"][],
  ];

export const inquirySchema = z
  .object({
    enquiryType: z.enum(optionValues(enquiryTypeOptions), {
      message: "Please choose what brings you here.",
    }),
    currentProblems: z.array(z.enum(optionValues(currentProblemOptions))).max(9).optional(),
    otherProblemNote: z.string().trim().max(300).optional().or(z.literal("")),
    audiences: z.array(z.enum(optionValues(audienceOptions))).max(9).optional(),
    desiredOutcomes: z.array(z.enum(optionValues(desiredOutcomeOptions))).max(11).optional(),
    projectStage: z.enum(optionValues(projectStageOptions)).optional(),
    additionalContext: z.string().trim().max(600).optional().or(z.literal("")),
    timeline: z.enum(optionValues(timelineOptions)).optional(),
    budget: z.enum(optionValues(budgetOptions)).optional(),
    name: z.string().trim().min(1, "Please let me know your name.").max(200),
    email: z.string().trim().min(1, "Please add an email address.").email("That email doesn't look right."),
    phone: z.string().trim().max(50).optional().or(z.literal("")),
    organisation: z.string().trim().max(200).optional().or(z.literal("")),
    honeypot: z.string().max(200).optional().or(z.literal("")),
    startedAt: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.currentProblems?.length) {
      ctx.addIssue({
        code: "custom",
        path: ["currentProblems"],
        message: "Pick anything that sounds familiar.",
      });
    }
    if (!data.audiences?.length) {
      ctx.addIssue({
        code: "custom",
        path: ["audiences"],
        message: "Choose at least one — 'Not sure yet' is a valid answer.",
      });
    }
    if (!data.desiredOutcomes?.length) {
      ctx.addIssue({
        code: "custom",
        path: ["desiredOutcomes"],
        message: "Choose the outcomes that matter most — it's fine to pick just one.",
      });
    }
    if (!data.projectStage) {
      ctx.addIssue({
        code: "custom",
        path: ["projectStage"],
        message: "Please choose where things stand today.",
      });
    }
    if (!data.timeline) {
      ctx.addIssue({
        code: "custom",
        path: ["timeline"],
        message: "Please pick the option closest to your situation.",
      });
    }
  });

export type InquiryInput = z.infer<typeof inquirySchema>;

export type InquiryStatus = "new" | "reviewed" | "contacted" | "closed";

export type Inquiry = {
  id: string;
  createdAt: string;
  enquiryType: string;
  currentProblems?: string[];
  otherProblemNote?: string;
  audiences?: string[];
  desiredOutcomes?: string[];
  projectStage?: string;
  additionalContext?: string;
  timeline?: string;
  budget?: string;
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  status: InquiryStatus;
  internalSummary?: string;
  summary: string;
};

type SummaryInput = {
  enquiryType?: string;
  currentProblems?: string[];
  otherProblemNote?: string;
  audiences?: string[];
  desiredOutcomes?: string[];
  projectStage?: string;
  additionalContext?: string;
  timeline?: string;
  budget?: string;
  name?: string;
  email?: string;
  phone?: string;
  organisation?: string;
};

/**
 * Turns the structured selections into a flat, readable brief — used for
 * the review screen, the stored `summary` column, and the notification
 * email, so nothing downstream has to parse a free-text essay.
 */
export function buildInquirySummary(data: SummaryInput): string {
  const lines: string[] = [];

  lines.push(`Looking for: ${labelFor(enquiryTypeOptions, data.enquiryType)}`);

  if (data.currentProblems?.length) {
    lines.push("", "Current problem:");
    for (const value of data.currentProblems) {
      if (value === "other" && data.otherProblemNote) {
        lines.push(`- Something else: ${data.otherProblemNote}`);
      } else {
        lines.push(`- ${labelFor(currentProblemOptions, value)}`);
      }
    }
  }

  if (data.audiences?.length) {
    lines.push("", `For: ${data.audiences.map((value) => labelFor(audienceOptions, value)).join(", ")}`);
  }

  if (data.desiredOutcomes?.length) {
    lines.push("", "Desired outcome:");
    for (const value of data.desiredOutcomes) {
      lines.push(`- ${labelFor(desiredOutcomeOptions, value)}`);
    }
  }

  if (data.projectStage) {
    lines.push("", `Current stage: ${labelFor(projectStageOptions, data.projectStage)}`);
  }

  if (data.additionalContext) {
    lines.push("", `Additional context: "${data.additionalContext}"`);
  }

  lines.push("", `Timeline: ${labelFor(timelineOptions, data.timeline) || "—"}`);
  if (data.budget) {
    lines.push(`Budget: ${labelFor(budgetOptions, data.budget)}`);
  }

  lines.push("", "Contact:", `Name: ${data.name ?? ""}`, `Email: ${data.email ?? ""}`);
  if (data.phone) lines.push(`Phone / WhatsApp: ${data.phone}`);
  if (data.organisation) lines.push(`Organisation: ${data.organisation}`);

  return lines.join("\n");
}

/**
 * Deterministic hints only — a lightweight lookup table, not a model or
 * scoring system. Guides attention toward likely-relevant answers without
 * hiding anything else; every option stays fully selectable regardless.
 */
const recommendedProblemsByEnquiryType: Partial<Record<EnquiryType, CurrentProblem[]>> = {
  automation: ["manual_work", "spreadsheets_whatsapp", "time_consuming"],
  improve_existing: ["system_not_working", "customer_struggle", "hard_to_track", "scattered_info"],
  website: ["customer_struggle", "scattered_info", "system_not_working"],
  process_problem: ["manual_work", "time_consuming", "hard_to_track"],
  system: ["system_not_working", "scattered_info"],
  idea: ["nothing_yet"],
};

export function isRecommendedProblem(enquiryType: string | undefined, problem: string): boolean {
  if (!enquiryType) return false;
  const list = recommendedProblemsByEnquiryType[enquiryType as EnquiryType];
  return list ? (list as string[]).includes(problem) : false;
}

type InterpretationInput = {
  enquiryType?: string;
  currentProblems?: string[];
  desiredOutcomes?: string[];
};

/**
 * Deterministic, rule-based composition — no model call. Reflects the
 * visitor's own selections back in plain language once there's enough to
 * say something useful; returns null until then.
 */
export function buildLiveInterpretation(data: InterpretationInput): string | null {
  const problems = data.currentProblems ?? [];
  const outcomes = data.desiredOutcomes ?? [];
  const type = data.enquiryType;

  if (!type || (problems.length === 0 && outcomes.length === 0)) {
    return null;
  }

  const hasManual = problems.includes("manual_work") || problems.includes("time_consuming");
  const hasScattered = problems.includes("scattered_info") || problems.includes("spreadsheets_whatsapp");
  const hasCustomerFriction = problems.includes("customer_struggle");
  const hasBrokenSystem = problems.includes("system_not_working");
  const hasTracking = problems.includes("hard_to_track");
  const wantsAutomation = outcomes.includes("automate_repetitive") || type === "automation";
  const wantsOrganise = outcomes.includes("organise_info") || outcomes.includes("findable_info");
  const wantsCustomerExp = outcomes.includes("customer_experience") || outcomes.includes("sales_leads");

  if (type === "website" || wantsCustomerExp || hasCustomerFriction) {
    return "This sounds like a customer-facing project where easier access to information and a clearer digital experience matter most.";
  }
  if (hasBrokenSystem || (type === "improve_existing" && (wantsAutomation || wantsOrganise))) {
    return "This sounds like an existing workflow that could benefit from automation and better information management.";
  }
  if (hasManual && hasScattered) {
    return "This sounds like a workflow problem involving manual processes and scattered information.";
  }
  if (hasManual) {
    return "This sounds like a process that's taking more manual effort than it needs to.";
  }
  if (hasScattered || wantsOrganise) {
    return "This sounds like information that's scattered and could use a clearer home.";
  }
  if (hasTracking) {
    return "This sounds like something that's difficult to track or verify right now.";
  }
  if (type === "idea") {
    return "This sounds like an early idea that's still taking shape.";
  }
  if (type === "collaborate") {
    return "This sounds like the beginning of a possible collaboration.";
  }
  return "This is starting to take shape — a few more answers will sharpen the picture.";
}
