import { REVIEW_CRITERIA, type TripReviewSummaryData } from "@/types/review";
import { RatingBar } from "./RatingBar";

/**
 * Aggregate header: big score + verdict label on the left, five
 * criterion bars on the right. Bars are hidden entirely when there are
 * no reviews (design §3.3). Server Component.
 */
export function ReviewSummaryBlock({
  summary,
}: {
  summary: TripReviewSummaryData;
}) {
  const isEmpty = summary.count === 0;

  return (
    <div className="grid grid-cols-1 gap-5 rounded-lg bg-subtle p-6 md:grid-cols-12">
      <div className="flex flex-col items-center justify-center gap-1 py-2 md:col-span-3">
        <div className="text-[50px] font-bold tabular-nums text-primary mb-2.5">
          {isEmpty ? "—" : summary.averageRating.toFixed(1)}
        </div>
        <div className="text-xl font-normal ">{summary.ratingLabel}</div>
        <div className="text-xs text-muted">
          {isEmpty ?? "Be the first to review"}
        </div>
      </div>

      {!isEmpty && (
        <div className="grid content-center gap-3.5 md:col-span-9">
          {REVIEW_CRITERIA.map((criterion) => (
            <RatingBar
              key={criterion.key}
              label={criterion.label}
              value={summary.breakdown[criterion.key]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
