"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ReviewSchema,
  type ReviewFormData,
  REVIEW_CRITERIA,
} from "@/lib/validations/review";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";

/**
 * Review submission form (Reviews tab).
 * Shared ReviewSchema drives both client (RHF) and a future
 * Server Action for persisting to WordPress.
 */
export function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [criteria, setCriteria] = useState<Record<string, number>>(
    REVIEW_CRITERIA.reduce(
      (acc, c) => ({ ...acc, [c]: 0 }),
      {} as Record<string, number>,
    ),
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      criteria: REVIEW_CRITERIA.reduce(
        (acc, c) => ({ ...acc, [c]: 0 }),
        {} as Record<string, number>,
      ),
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    // Placeholder — wire to Server Action in a later phase.
    void data;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      aria-label="Write a review"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-heading mb-1">
          Your rating
        </label>
        <StarRating
          value={rating}
          interactive
          onChange={setRating}
          className="!justify-start"
        />
        <input type="hidden" {...register("rating")} value={rating} />
        {errors.rating ? (
          <p className="mt-1 text-sm text-error">{errors.rating.message}</p>
        ) : null}
      </div>

      {REVIEW_CRITERIA.map((criterion) => (
        <div key={criterion}>
          <label className="block text-sm font-medium text-heading mb-1">
            {criterion}
          </label>
          <StarRating
            value={criteria[criterion]}
            interactive
            onChange={(v) =>
              setCriteria((prev) => ({ ...prev, [criterion]: v }))
            }
            className="!justify-start"
          />
          <input
            type="hidden"
            {...register(`criteria.${criterion}` as `${keyof ReviewFormData}`)}
            value={criteria[criterion]}
          />
        </div>
      ))}

      <Textarea
        placeholder="Your review..."
        rows={4}
        error={errors.review?.message}
        {...register("review")}
      />

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit Review"}
      </Button>
    </form>
  );
}

ReviewForm.displayName = "ReviewForm";
