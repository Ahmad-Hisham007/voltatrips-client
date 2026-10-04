import type { Trip } from "@/lib/queries/trip";
import type { ReviewCommentNode, TripReviewSummaryData } from "@/types/review";
import { ReviewForm } from "@/components/review-form";
import { ReviewSummaryBlock } from "./reviews/ReviewSummaryBlock";
import { ReviewList } from "./reviews/ReviewList";

interface ReviewsTabProps {
  /** Whole trip node — `databaseId` threads down to the form as `commentOn` (D4). */
  trip: Trip;
  comments: ReviewCommentNode[];
  summary: TripReviewSummaryData;
}

/**
 * Reviews tab orchestrator (Server Component). Three sections split by
 * hairline dividers: aggregate header, review list, submission form.
 * The form is the only client island.
 */
function ReviewsTab({ trip, comments, summary }: ReviewsTabProps) {
  return (
    <div className="space-y-10">
      {/* 1. Aggregate header */}
      <section aria-labelledby="reviews-summary-heading" className="space-y-6">
        <div>
          <h2
            id="reviews-summary-heading"
            className="text-2xl font-bold text-heading lg:text-3xl"
          >
            Customer Reviews
          </h2>
          <p className="mt-1 text-body">
            {summary.count === 0
              ? "No reviews yet — share your experience of this trip first."
              : `${summary.count} review${summary.count === 1 ? "" : "s"} for ${trip.title}.`}
          </p>
        </div>
        <ReviewSummaryBlock summary={summary} />
      </section>

      <hr className="border-border" />

      {/* 2. Review list */}
      <section aria-labelledby="reviews-list-heading" className="space-y-6">
        <h3
          id="reviews-list-heading"
          className="text-2xl  font-bold text-heading"
        >
          What travelers say
        </h3>
        <ReviewList comments={comments} />
      </section>

      <hr className="border-border" />

      {/* 3. Submission form (client island) */}
      <section aria-labelledby="review-form-heading" className="space-y-6">
        <div>
          <h3
            id="review-form-heading"
            className="text-2xl font-bold text-heading"
          >
            Leave a Reply
          </h3>
        </div>
        <ReviewForm commentOn={trip.databaseId} />
      </section>
    </div>
  );
}

export default ReviewsTab;
