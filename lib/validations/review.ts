import { z } from "zod";

export const REVIEW_CRITERIA = [
  "Accommodation",
  "Meals",
  "Transport",
  "Value for Money",
] as const;

/**
 * Review form schema — powers the Reviews tab submission form.
 * Shared between the client form (React Hook Form) and a future
 * Server Action for persisting to WordPress.
 */
export const ReviewSchema = z.object({
  name: z.string().min(1, "Your name is required."),
  email: z.string().email("Please enter a valid email."),
  rating: z
    .number()
    .min(1, "Please select a rating.")
    .max(5, "Maximum rating is 5."),
  review: z.string().min(10, "Review must be at least 10 characters."),
  // per-criterion star rating (1-5), matching the WP review model
  criteria: z
    .object(
      REVIEW_CRITERIA.reduce(
        (acc, c) => ({ ...acc, [c]: z.number().min(0).max(5) }),
        {} as Record<string, z.ZodNumber>,
      ),
    )
    .strict(),
});

export type ReviewFormData = z.infer<typeof ReviewSchema>;
