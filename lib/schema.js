import { z } from "zod";

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

export const onboardSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name must be at most 80 characters")
    .regex(nameRegex, "Full name contains invalid characters"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().min(2, "Company name is required").max(100),
  services: z
    .array(z.enum(["UI/UX", "Branding", "Web Dev", "Mobile App"]))
    .min(1, "Select at least one service"),
  budgetUsd: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === "") return undefined;
      if (typeof val === "string" && val.trim() === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    })
    .refine(
      (val) =>
        val === undefined ||
        (typeof val === "number" &&
          Number.isInteger(val) &&
          val >= 100 &&
          val <= 1000000),
      { message: "Budget must be an integer between 100 and 1,000,000" }
    ),
  projectStartDate: z.string().refine(
    (str) => {
      if (!str) return false;
      const given = new Date(str + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return given >= today;
    },
    { message: "Project start date must be today or later" }
  ),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
});

export function parseFormData(raw) {
  const payload = {
    fullName: raw.fullName,
    email: raw.email,
    companyName: raw.companyName,
    services: raw.services || [],
    budgetUsd: raw.budgetUsd,
    projectStartDate: raw.projectStartDate,
    acceptTerms: raw.acceptTerms === true || raw.acceptTerms === "true",
  };
  return onboardSchema.parse(payload);
}
