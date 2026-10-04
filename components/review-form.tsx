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

const ReviewFormSchema = CreateReviewSchema.omit({ commentOn: true });

type FormInput = z.input<typeof ReviewFormSchema>;
type FormOutput = z.output<typeof ReviewFormSchema>;

const SAVE_KEY = "voltatrips:review-author";

const DEFAULT_RATINGS = {
  accommodationRating: 0,
  mealsRating: 0,
  overallRating: 0,
  transportRating: 0,
  valueForMoneyRating: 0,
};

// Subtle full-width input style matching the reference
const inputClass =
  "w-full border border-gray-200 bg-[#F9F9F9] px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-primary focus:bg-white focus:outline-none";
const errorClass = "text-xs text-red-500 mt-1";

export function ReviewForm({ commentOn }: { commentOn: number }) {
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

  const setRating = (ratingKey: keyof typeof DEFAULT_RATINGS, next: number) => {
    setValue(`reviewRatings.${ratingKey}`, next, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="space-y-5"
        aria-label="Write a review"
        noValidate
      >
        {/* Status Message */}
        <div aria-live="polite">
          {result && (
            <div
              role="status"
              className={
                result.ok
                  ? "rounded bg-green-50 p-4 text-sm text-green-700"
                  : "rounded bg-red-50 p-4 text-sm text-red-600"
              }
            >
              {result.ok ? (
                result.status === "APPROVE" ? (
                  "Your review has been published — thank you!"
                ) : (
                  <>
                    <strong className="font-semibold">Thank you!</strong> Your
                    review is awaiting moderation.
                  </>
                )
              ) : (
                result.message
              )}
            </div>
          )}
        </div>

        {/* 1. Criteria Star Ratings Grid (Exact Row 1 & Row 2 layout) */}
        <div className="space-y-2.5 pb-2">
          {/* Row 1: Accommodation, Meals, Overall */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-3">
            {REVIEW_CRITERIA.slice(0, 3).map((criterion) => (
              <div key={criterion.key} className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                  {criterion.label}
                </span>
                <StarRating
                  value={ratings[criterion.ratingKey]}
                  interactive
                  size={16}
                  onChange={(next) => setRating(criterion.ratingKey, next)}
                />
              </div>
            ))}
          </div>

          {/* Row 2: Transport, Value for Money */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-3">
            {REVIEW_CRITERIA.slice(3, 5).map((criterion) => (
              <div key={criterion.key} className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                  {criterion.label}
                </span>
                <StarRating
                  value={ratings[criterion.ratingKey]}
                  interactive
                  size={16}
                  onChange={(next) => setRating(criterion.ratingKey, next)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 2. Your Comment Textarea */}
        <div>
          <textarea
            id="review-content"
            rows={5}
            placeholder="Your comment"
            aria-invalid={Boolean(errors.content)}
            className={`${inputClass} ${errors.content ? "border-red-500" : ""}`}
            {...register("content")}
          />
          {errors.content && (
            <p className={errorClass}>{errors.content.message}</p>
          )}
        </div>

        {/* 3. Stacked Fields: Name, Email, Website */}
        <div className="space-y-4">
          <div>
            <input
              id="review-author"
              type="text"
              placeholder="Your Name"
              autoComplete="name"
              aria-invalid={Boolean(errors.author)}
              className={`${inputClass} ${errors.author ? "border-red-500" : ""}`}
              {...register("author")}
            />
            {errors.author && (
              <p className={errorClass}>{errors.author.message}</p>
            )}
          </div>

          <div>
            <input
              id="review-email"
              type="email"
              placeholder="Your Email"
              inputMode="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.authorEmail)}
              className={`${inputClass} ${errors.authorEmail ? "border-red-500" : ""}`}
              {...register("authorEmail")}
            />
            {errors.authorEmail && (
              <p className={errorClass}>{errors.authorEmail.message}</p>
            )}
          </div>
        </div>

        {/* 4. Checkbox */}
        <label
          htmlFor="review-save-info"
          className="flex items-center gap-2 text-gray-500 cursor-pointer pt-1"
        >
          <input
            id="review-save-info"
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#FF5722]"
            {...register("saveInfo")}
          />
          Save my name, email, and website in this browser for the next time I
          comment.
        </label>

        {/* 5. Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center cursor-pointer justify-center bg-primary px-10 py-4 font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                SUBMITTING...
              </>
            ) : (
              "SUBMIT"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
