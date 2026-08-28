import type { InquiryInput } from "@/lib/inquiry";

export type Draft = Partial<InquiryInput>;

export type StepProps = {
  draft: Draft;
  errors: Record<string, string>;
  update: (patch: Draft) => void;
};
