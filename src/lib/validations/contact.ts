import { z } from "zod";

export const serviceOptions = [
  "Towing Services",
  "Security Solutions",
  "Logistics & Transport",
  "Courier Services",
  "Technology Solutions",
  "Property Services",
  "Staffing Services",
  "Business Consulting",
] as const;

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
  services: z.array(z.string()).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Split name into first and last for Brevo
export function splitName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}
