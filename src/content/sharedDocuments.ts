export type SharedDocument = {
  slug: string;
  title: string;
  recipient: string;
  preparedBy: string;
  date: string;
  status: string;
  description: string;
  pdfPath: `/documents/${string}.pdf`;
  category?: string;
  projectName?: string;
  /** Informational only; access expiry is not enforced in this version. */
  expiryDate?: string;
  version?: string;
  accent?: "green" | "gold";
  viewLabel?: string;
  reviewNote?: string;
};

export const sharedDocuments: readonly SharedDocument[] = [
  {
    slug: "rammego-nda",
    title: "Mutual Non-Disclosure & Confidentiality Agreement",
    recipient: "Shime R. E. Rammego",
    preparedBy: "AiForm Studio (Pty) Ltd",
    date: "12 September 2026",
    status: "For review & signature",
    description: "Prepared for the confidential exploration of a proposed business assessment methodology and digital product.",
    pdfPath: "/documents/aiform-studio-mutual-nda-shime-rammego-2026-09-12.pdf",
    category: "Legal",
    version: "1.0",
    viewLabel: "View agreement",
    reviewNote: "This document has been prepared specifically for the recipient named above. Please review the agreement and contact AiForm Studio if you would like to propose any changes before signing.",
  },
];

export function getSharedDocument(slug: string) {
  return sharedDocuments.find((document) => document.slug === slug);
}
