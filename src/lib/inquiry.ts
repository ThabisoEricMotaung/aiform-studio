import { z } from "zod";

export const inquiryTypeOptions = [
  { value: "problem", label: "I have a problem to solve" },
  { value: "project", label: "I have a project in mind" },
  { value: "improve", label: "I want to improve an existing system" },
  { value: "collaborate", label: "I want to collaborate" },
  { value: "unsure", label: "I'm not sure yet" },
] as const;

export const collaborationTypeOptions = [
  { value: "research", label: "Research" },
  { value: "product", label: "Product development" },
  { value: "technical", label: "Technical build" },
  { value: "data", label: "Data / verification" },
  { value: "content", label: "Content / publishing" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
] as const;

export const currentStageOptions = [
  { value: "idea", label: "Just an idea" },
  { value: "manual", label: "Using a manual process" },
  { value: "existing_system", label: "We already have a website/system" },
  { value: "building", label: "We're already building something" },
  { value: "diagnosing", label: "We need help diagnosing the problem" },
  { value: "other", label: "Other" },
] as const;

export const helpTypeOptions = [
  { value: "website", label: "Website" },
  { value: "internal_system", label: "Internal system" },
  { value: "automation", label: "Automation" },
  { value: "data_verification", label: "Data / verification" },
  { value: "ai_workflow", label: "AI-assisted workflow" },
  { value: "product_development", label: "Product development" },
  { value: "research_collaboration", label: "Research / collaboration" },
  { value: "integration_api", label: "Integration / API work" },
  { value: "not_sure", label: "Not sure" },
] as const;

export const timingOptions = [
  { value: "none", label: "No fixed deadline" },
  { value: "1_month", label: "Within 1 month" },
  { value: "1_3_months", label: "1–3 months" },
  { value: "3_plus_months", label: "3+ months" },
  { value: "not_sure", label: "Not sure" },
] as const;

export const budgetRangeOptions = [
  { value: "figuring_out", label: "Still figuring it out" },
  { value: "under_10k", label: "Under R10,000" },
  { value: "10k_30k", label: "R10,000–R30,000" },
  { value: "30k_75k", label: "R30,000–R75,000" },
  { value: "75k_plus", label: "R75,000+" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export const preferredContactOptions = [
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "call", label: "Call" },
] as const;

type OptionValue<T extends readonly { value: string }[]> = T[number]["value"];

export type InquiryType = OptionValue<typeof inquiryTypeOptions>;
export type CollaborationType = OptionValue<typeof collaborationTypeOptions>;
export type CurrentStage = OptionValue<typeof currentStageOptions>;
export type HelpType = OptionValue<typeof helpTypeOptions>;
export type Timing = OptionValue<typeof timingOptions>;
export type BudgetRange = OptionValue<typeof budgetRangeOptions>;
export type PreferredContact = OptionValue<typeof preferredContactOptions>;

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

const urlLikeField = z
  .string()
  .trim()
  .max(500, "That link looks a little long — please shorten it.")
  .optional()
  .or(z.literal(""));

export const inquirySchema = z
  .object({
    inquiryType: z.enum(optionValues(inquiryTypeOptions), {
      message: "Please choose what brings you here.",
    }),
    collaborationType: z.array(z.enum(optionValues(collaborationTypeOptions))).max(7).optional(),
    problemDescription: z.string().trim().max(4000).optional().or(z.literal("")),
    projectDescription: z.string().trim().max(4000).optional().or(z.literal("")),
    desiredOutcome: z.string().trim().max(2000).optional().or(z.literal("")),
    currentStage: z.enum(optionValues(currentStageOptions)).optional(),
    existingUrl: urlLikeField,
    currentStateNote: z.string().trim().max(1000).optional().or(z.literal("")),
    referenceNotes: z.string().trim().max(2000).optional().or(z.literal("")),
    helpTypes: z.array(z.enum(optionValues(helpTypeOptions))).max(9).optional(),
    timing: z.enum(optionValues(timingOptions)).optional(),
    budgetRange: z.enum(optionValues(budgetRangeOptions)).optional(),
    name: z.string().trim().min(1, "Please let me know your name.").max(200),
    email: z.string().trim().min(1, "Please add an email address.").email("That email doesn't look right."),
    phone: z.string().trim().max(50).optional().or(z.literal("")),
    organisation: z.string().trim().max(200).optional().or(z.literal("")),
    role: z.string().trim().max(200).optional().or(z.literal("")),
    preferredContact: z.enum(optionValues(preferredContactOptions)).optional(),
    honeypot: z.string().max(200).optional().or(z.literal("")),
    startedAt: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    const minText = (value: string | undefined, min: number, path: string, message: string) => {
      if (!value || value.trim().length < min) {
        ctx.addIssue({ code: "custom", path: [path], message });
      }
    };

    if (data.inquiryType === "problem") {
      minText(
        data.problemDescription,
        30,
        "problemDescription",
        "A few more sentences would help me understand what's going on.",
      );
    } else if (data.inquiryType === "project") {
      minText(
        data.projectDescription,
        30,
        "projectDescription",
        "Tell me a little more about what you're hoping to build.",
      );
    } else if (data.inquiryType === "improve") {
      minText(
        data.problemDescription,
        20,
        "problemDescription",
        "Tell me what exists today and what's frustrating about it.",
      );
    } else if (data.inquiryType === "collaborate") {
      minText(
        data.projectDescription,
        10,
        "projectDescription",
        "Tell me a little about the collaboration you have in mind.",
      );
    } else if (data.inquiryType === "unsure") {
      minText(
        data.problemDescription,
        10,
        "problemDescription",
        "Just a sentence or two about what's on your mind is enough.",
      );
    }

    if (!data.desiredOutcome || data.desiredOutcome.trim().length < 10) {
      ctx.addIssue({
        code: "custom",
        path: ["desiredOutcome"],
        message: "Please add a short line about what better would look like.",
      });
    }

    if (
      (data.preferredContact === "whatsapp" || data.preferredContact === "call") &&
      !data.phone
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Please add a number so I can reach you that way.",
      });
    }
  });

export type InquiryInput = z.infer<typeof inquirySchema>;

export type InquiryStatus = "new" | "reviewed" | "contacted" | "closed";

export type Inquiry = {
  id: string;
  createdAt: string;
  inquiryType: string;
  collaborationType?: string[];
  problemDescription?: string;
  projectDescription?: string;
  desiredOutcome?: string;
  currentStage?: string;
  existingUrl?: string;
  currentStateNote?: string;
  referenceNotes?: string;
  helpTypes?: string[];
  timing?: string;
  budgetRange?: string;
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  role?: string;
  preferredContact?: PreferredContact;
  status: InquiryStatus;
  internalSummary?: string;
};
