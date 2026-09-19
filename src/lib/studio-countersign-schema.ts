import { z } from "zod";
import { LEORA_DOCUMENT, STUDIO_COUNTERSIGNATORY } from "./leora-document";
import { signatureSchema } from "./leora-signing-schema";

export const countersignSchema = z.object({
  documentId: z.literal(LEORA_DOCUMENT.id),
  documentVersion: z.literal(LEORA_DOCUMENT.version),
  documentHash: z.literal(LEORA_DOCUMENT.sha256),
  executionId: z.string().uuid(),
  signatoryName: z.literal(STUDIO_COUNTERSIGNATORY.name),
  capacity: z.literal(STUDIO_COUNTERSIGNATORY.capacity),
  signature: signatureSchema,
  consent: z.literal(true),
}).strict();
