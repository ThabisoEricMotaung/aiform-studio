import { z } from "zod";
import { LEORA_DOCUMENT } from "./leora-document";

const point = z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }).strict();
export const signatureSchema = z.array(z.array(point).min(2).max(1500)).min(1).max(80)
  .superRefine((strokes, context) => {
    let distance = 0;
    let count = 0;
    for (const stroke of strokes) {
      count += stroke.length;
      for (let i = 1; i < stroke.length; i++) {
        distance += Math.hypot(stroke[i].x - stroke[i - 1].x, stroke[i].y - stroke[i - 1].y);
      }
    }
    if (count > 6000 || distance < 0.08) {
      context.addIssue({ code: "custom", message: "Please draw your signature in the signature area, or clear it and try again." });
    }
  });

export const signingSchema = z.object({
  documentId: z.literal(LEORA_DOCUMENT.id),
  documentVersion: z.literal(LEORA_DOCUMENT.version),
  documentHash: z.literal(LEORA_DOCUMENT.sha256),
  name: z.string().trim().min(2).max(200),
  business: z.string().trim().min(2).max(200),
  address: z.string().trim().min(10).max(1000),
  signingAs: z.enum(["individual", "company"]),
  entityName: z.string().trim().max(200),
  registrationNumber: z.string().trim().max(100),
  capacity: z.string().trim().max(150),
  signature: signatureSchema,
  consent: z.literal(true),
}).strict().superRefine((data, context) => {
  if (data.signingAs === "company") {
    for (const key of ["entityName", "registrationNumber", "capacity"] as const) {
      if (!data[key]) context.addIssue({ code: "custom", path: [key], message: "Required when signing for a registered company." });
    }
  }
});
