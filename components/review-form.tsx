"use client";

import { useEffect, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { CreateReviewSchema } from "@/lib/validations/review";
import { submitReview, type SubmitReviewResult } from "@/lib/actions/review";
import { StarRating } from "@/components/ui/star-rating";
import { REVIEW_CRITERIA } from "@/types/review";

/**
 * Guest review form — the only "use client" piece of the Reviews tab.
 * `commentOn` arrives as a prop threaded from the page (D4); it is never
 * a DOM input. The `website` field is client-only: persisted with the
 * save-info payload in localStorage, never sent to the mutation (§9).
 */
const ReviewFormSchema = CreateReviewSchema.omit({ commentOn: true });
// `saveInfo` carries `.default(false)`, so the schema's input type
// (`boolean | undefined`) diverges from its output type (`boolean`).
// Type the form on the input shape and let RHF transform to the output
// shape on submit — the documented pattern for defaulted/coerced fields
// (@hookform/resolvers v5 + RHF v7). Keeps spec.md §5 frozen as-is.
type FormInput = z.input<typeof ReviewFormSchema>;
type FormOutput = z.output<typeof ReviewFormSchema>;

const SAVE_KEY = "voltatrips:review-author";

/** The four secondary criteria (Overall gets its own prominent tier). */
const CRITERIA_FIELDS = REVIEW_CRITERIA.filter(
  (criterion) => criterion.key !== "overall",
);

const DEFAULT_RATINGS = {
  accommodationRating: 0,
  mealsRating: 0,
  overallRating: 0,
  transportRating: 0,
  valueForMoneyRating: 0,
};

// Inline subtle-styled inputs (design §5.3 option b) — the shared
// Input/Textarea primitives are deliberately not used, matching
// booking-form.tsx.
const inputClass =
  "w-full rounded-md border border-transparent bg-subtle px-4 py-3 text-sm text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
const labelClass = "text-sm font-medium text-heading";
const errorClass = "text-xs text-error";

export function ReviewForm({ commentOn }: { commentOn: number }) {
  const [website, setWebsite] = useState("");
  const [result, setResult] = useState<SubmitReviewResult | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      content: "",
      author: "",
      authorEmail: "",
      saveInfo: false,
      reviewRatings: DEFAULT_RATINGS,
    },
  });

  const ratings = watch("reviewRatings");

  // Hydrate saved author info after mount (never during render) to keep
  // SSR and client output identical (design §5.4).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        author?: string;
        authorEmail?: string;
        website?: string;
      };
      if (saved.author) setValue("author", saved.author);
      if (saved.authorEmail) setValue("authorEmail", saved.authorEmail);
      if (saved.website) setWebsite(saved.website);
      setValue("saveInfo", true);
    } catch {
      localStorage.removeItem(SAVE_KEY);
    }
  }, [setValue]);

  const onSubmit = async (values: FormOutput) => {
    setResult(null);
    const res = await submitReview({ ...values, commentOn });

    if (res.ok) {
      if (values.saveInfo) {
        localStorage.setItem(
          SAVE_KEY,
          JSON.stringify({
            author: values.author,
            authorEmail: values.authorEmail,
            website,
          }),
        );
      } else {
        localStorage.removeItem(SAVE_KEY);
      }
      reset({
        ...values,
        content: "",
        reviewRatings: DEFAULT_RATINGS,
      });
    }
    setResult(res);
  };

  const onInvalid = (errs: FieldErrors<FormInput>) => {
    if (errs.content) setFocus("content");
    else if (errs.author) setFocus("author");
    else if (errs.authorEmail) setFocus("authorEmail");
  };

  const setRating = (
    ratingKey: keyof typeof DEFAULT_RATINGS,
    next: number,
  ) => {
    setValue(`reviewRatings.${ratingKey}`, next, { shouldValidate: true });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="grid gap-6"
      aria-label="Write a review"
      noValidate
    >
      {/* Persistent live region for submit outcome */}
      <div aria-live="polite">
        {result && (
          <div
            role="status"
            className={
              result.ok
                ? "rounded-md bg-subtle p-4 text-sm text-heading"
                : "rounded-md border border-error/30 bg-error/5 p-4 text-sm text-error"
            }
          >
            {result.ok ? (
              result.status === "APPROVE" ? (
                "Your review has been published — thank you!"
              ) : (
                <>
                  <strong className="font-semibold">Thank you!</strong> Your
                  review is awaiting moderation and will appear once approved.
                </>
              )
            ) : (
              result.message
            )}
          </div>
        )}
      </div>

      {/* Tier 1 — prominent Overall rating */}
      <div className="grid gap-2">
        <label id="rating-overall-label" className={labelClass}>
          Overall <span aria-hidden="true">*</span>
        </label>
        <StarRating
          value={ratings.overallRating}
          interactive
          size={24}
          labelledBy="rating-overall-label"
          onChange={(next) => setRating("overallRating", next)}
        />
        {errors.reviewRatings?.overallRating && (
          <p className={errorClass}>
            {errors.reviewRatings.overallRating.message}
          </p>
        )}
      </div>

      <hr className="border-border" />

      {/* Tier 2 — the four secondary criteria */}
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {CRITERIA_FIELDS.map((criterion) => {
          const fieldError =
            errors.reviewRatings?.[criterion.ratingKey];
          return (
            <div key={criterion.key} className="grid gap-2">
              <label
                id={`rating-${criterion.key}-label`}
                className={labelClass}
              >
                {criterion.label} <span aria-hidden="true">*</span>
              </label>
              <StarRating
                value={ratings[criterion.ratingKey]}
                interactive
                size={18}
                labelledBy={`rating-${criterion.key}-label`}
                onChange={(next) => setRating(criterion.ratingKey, next)}
              />
              {fieldError && <p className={errorClass}>{fieldError.message}</p>}
            </div>
          );
        })}
      </div>

      {/* Comment body */}
      <div className="grid gap-2">
        <label htmlFor="review-content" className={labelClass}>
          Review <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="review-content"
          rows={5}
          placeholder="Share your experience…"
          aria-invalid={Boolean(errors.content)}
          aria-describedby={
            errors.content ? "review-content-error" : undefined
          }
          className={`${inputClass} ${errors.content ? "border-error" : ""}`}
          {...register("content")}
        />
        {errors.content && (
          <p id="review-content-error" className={errorClass}>
            {errors.content.message}
          </p>
        )}
      </div>

      {/* Identity fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="review-author" className={labelClass}>
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="review-author"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={Boolean(errors.author)}
            aria-describedby={errors.author ? "review-author-error" : undefined}
            className={`${inputClass} ${errors.author ? "border-error" : ""}`}
            {...register("author")}
          />
          {errors.author && (
            <p id="review-author-error" className={errorClass}>
              {errors.author.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="review-email" className={labelClass}>
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="review-email"
            type="email"
            placeholder="your@email.com"
            inputMode="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.authorEmail)}
            aria-describedby={
              errors.authorEmail ? "review-email-error" : undefined
            }
            className={`${inputClass} ${errors.authorEmail ? "border-error" : ""}`}
            {...register("authorEmail")}
          />
          {errors.authorEmail && (
            <p id="review-email-error" className={errorClass}>
              {errors.authorEmail.message}
            </p>
          )}
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <label htmlFor="review-website" className={labelClass}>
            Website
          </label>
          <input
            id="review-website"
            type="url"
            placeholder="Website"
            inputMode="url"
            autoComplete="url"
            className={inputClass}
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>
      </div>

      {/* Save info (localStorage, client-only) */}
      <label
        htmlFor="review-save-info"
        className="flex items-start gap-2.5 text-sm text-body"
      >
        <input
          id="review-save-info"
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 accent-primary"
          {...register("saveInfo")}
        />
        Save my name, email, and website in this browser for the next time I
        comment.
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold tracking-wide text-primary-content transition-colors hover:bg-primary/90 disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            POSTING…
          </>
        ) : (
          "SUBMIT REVIEW"
        )}
      </button>
    </form>
  );
}