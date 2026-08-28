import type { InquiryInput } from "@/lib/inquiry";

export type Draft = Partial<InquiryInput>;

export type StepProps = {
  draft: Draft;
  errors: Record<string, string>;
  update: (patch: Draft) => void;
  /**
   * For mutually-exclusive, single-select questions only: applies the
   * selection immediately (so the checked style shows at once) and
   * auto-advances to the next step shortly after, instead of waiting for
   * a Continue click.
   */
  selectAndAdvance: (patch: Draft) => void;
};
