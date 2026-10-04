import { z } from "zod";

/**
 * Review submission contracts — spec.md §5 (frozen).
 *
 * Replaces the former 4-criteria `ReviewSchema` + separate `rating`.
 * Five criteria, each 1–5. `commentOn` is the WP post database ID and is
 * supplied by the server/page (D4) — never a DOM input.
 *
 * Note: `authorEmail` uses `z.email()` (Zod v4) to match the rest of the
 * codebase; spec.md's `z.string().email()` is the deprecated v3 spelling of
 * the same rule.
 */
export const ReviewRatingsSchema = z.object({
  accommodationRating: z
    .number()
    .min(1, "Please select Accommodation rating")
    .max(5),
  mealsRating: z.number().min(1, "Please select Meals rating").max(5),
  overallRating: z.number().min(1, "Please select Overall rating").max(5),
  transportRating: z.number().min(1, "Please select Transport rating").max(5),
  valueForMoneyRating: z
    .number()
    .min(1, "Please select Value for Money rating")
    .max(5),
});

export const CreateReviewSchema = z.object({
  commentOn: z.number().min(1),
  content: z.string().min(10, "Comment must be at least 10 characters long"),
  author: z.string().min(2, "Name is required"),
  authorEmail: z.email("Please enter a valid email address"),
  saveInfo: z.boolean().optional().default(false),
  reviewRatings: ReviewRatingsSchema,
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;