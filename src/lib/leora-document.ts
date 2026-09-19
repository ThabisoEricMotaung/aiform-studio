export const LEORA_DOCUMENT = {
  id: "aiform-leora-mutual-nda",
  version: "2026-09-16.v1",
  reference: "AFS-LEORA-NDA-20260916-v1",
  pdfPath: "/documents/leora-group/AiForm-Studio-LeOra-Group-Mutual-NDA.pdf",
  sha256: "79269f1c14dd6d3c7d6c456c136d118588c99ed15a6f36ce05f204f8b855bfcd",
} as const;

export const SIGNING_CONSENT = "I confirm that I have reviewed this Mutual Non-Disclosure Agreement, intend my electronic signature to constitute my signature on this version of the agreement, and am authorised to sign in the stated capacity where applicable.";
export const CONSENT_VERSION = "2026-09-16.v1";

export const STUDIO_COUNTERSIGNATORY = {
  name: "Dr Thabiso Eric Motaung",
  capacity: "Authorised representative",
  entity: "AiForm Studio (Pty) Ltd",
  registrationNumber: "2026/692621/07",
} as const;
export const COUNTERSIGN_CONSENT = `I, ${STUDIO_COUNTERSIGNATORY.name}, confirm that I have reviewed the executed Mutual Non-Disclosure Agreement referenced above, that I am the ${STUDIO_COUNTERSIGNATORY.capacity} of ${STUDIO_COUNTERSIGNATORY.entity} (Registration ${STUDIO_COUNTERSIGNATORY.registrationNumber}), and that I intend my electronic signature below to constitute AiForm Studio's countersignature on this version of the agreement.`;
export const COUNTERSIGN_CONSENT_VERSION = "2026-09-18.v1";
export const EXECUTION_STATUS = {
  awaiting_signatory: "Awaiting your signature",
  awaiting_countersignature: "Awaiting AiForm Studio countersignature",
  fully_executed: "Fully executed",
} as const;
export type ExecutionStatus = keyof typeof EXECUTION_STATUS;
export type SignaturePoint = { x: number; y: number };
export type SignatureStrokes = SignaturePoint[][];
export type ExecutionReceipt = {
  id: string;
  signatory: string;
  signedAt: string;
  reference: string;
  sha256: string;
  status: ExecutionStatus;
};
