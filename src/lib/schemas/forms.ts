import { z } from "zod";

/**
 * Shared form rules. Error values are i18n keys in the `forms` dictionary group,
 * so the same schema serves every language.
 */
export type FormErrorKey =
  | "errName"
  | "errRating"
  | "errBody"
  | "errEmail"
  | "errSource"
  | "errContact"
  | "errReferrer"
  | "errIdentifier";

const EMAIL = z.string().email();
const PHONE = /^\+?[0-9\s().-]{6,20}$/;

export function isEmailOrPhone(value: string) {
  const v = value.trim();
  return EMAIL.safeParse(v).success || (PHONE.test(v) && v.replace(/\D/g, "").length >= 6);
}

export const reviewSchema = z.object({
  name: z.string().trim().min(1, "errName").max(60, "errName"),
  rating: z.number().int().min(1, "errRating").max(5, "errRating"),
  body: z.string().trim().min(10, "errBody").max(1200, "errBody"),
  email: z
    .string()
    .trim()
    .max(160, "errEmail")
    .refine((v) => v === "" || EMAIL.safeParse(v).success, "errEmail"),
});

export const discoverySchema = z
  .object({
    source: z.string().trim().min(1, "errSource"),
    name: z.string().trim().max(80),
    contact: z.string().trim().max(160, "errContact").refine(isEmailOrPhone, "errContact"),
    referrer: z.string().trim().max(160),
  })
  .refine((d) => d.source !== "friend" || d.referrer.length > 0, {
    message: "errReferrer",
    path: ["referrer"],
  });

export const loyaltyLookupSchema = z.object({
  identifier: z.string().trim().max(160, "errIdentifier").refine(isEmailOrPhone, "errIdentifier"),
});

/** Run a schema and return the first error key per field (empty when valid). */
export function fieldErrors<T extends z.ZodTypeAny>(schema: T, data: unknown) {
  const result = schema.safeParse(data);
  const errors: Record<string, FormErrorKey> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (!errors[key]) errors[key] = issue.message as FormErrorKey;
    }
  }
  return errors;
}
