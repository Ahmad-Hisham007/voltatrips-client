import Image from "next/image";
import { StarRating } from "@/components/ui/star-rating";
import { REVIEW_CRITERIA, type ReviewCommentNode } from "@/types/review";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function ReviewCommentItem({ comment }: { comment: ReviewCommentNode }) {
  const { author, reviewRatings } = comment;
  const avatarUrl = author.node.avatar?.url;

  return (
    <article className="flex gap-5 items-start py-8">
      {/* 1. Left Avatar */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-200">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${author.node.name}'s avatar`}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-bold text-gray-500">
            {initialsOf(author.node.name)}
          </div>
        )}
      </div>

      {/* 2. Content Body & Details */}
      <div className="flex-1 space-y-3 pt-0.5">
        <div>
          <h4 className="text-[25px] font-bold text-gray-900 leading-tight">
            {author.node.name}
          </h4>
          <p className="text-[15px] font-light text-body leading-relaxed mt-1">
            {dateFormatter.format(new Date(comment.date))}
          </p>
        </div>

        {/* Comment HTML text body */}
        <div
          className="text-[15px] text-body leading-relaxed max-w-4xl"
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />

        {/* 3. Criteria Stars Layout - Exact 3-column top, 2-column bottom match */}
        <div className="pt-2">
          {/* Row 1: Accommodation, Meals, Overall */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 max-w-3xl">
            {REVIEW_CRITERIA.slice(0, 3).map((criterion) => (
              <div key={criterion.key} className="flex items-center gap-2">
                <span className="text-[17px] font-bold text-gray-900 leading-normal whitespace-nowrap">
                  {criterion.label}
                </span>
                <StarRating
                  value={reviewRatings[criterion.ratingKey]}
                  size={14}
                  className="text-primary"
                />
              </div>
            ))}
          </div>

          {/* Row 2: Transport, Value for Money */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 max-w-3xl mt-2">
            {REVIEW_CRITERIA.slice(3, 5).map((criterion) => (
              <div key={criterion.key} className="flex items-center gap-2">
                <span className="text-[17px] font-bold text-gray-900 leading-normal whitespace-nowrap">
                  {criterion.label}
                </span>
                <StarRating
                  value={reviewRatings[criterion.ratingKey]}
                  size={14}
                  className="text-primary"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
