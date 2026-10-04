import Image from "next/image";

import { StarRating } from "@/components/ui/star-rating";
import { REVIEW_CRITERIA, type ReviewCommentNode } from "@/types/review";

// Explicit locale keeps SSR output deterministic (design §4.2).
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
});

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * A single approved review: avatar (Gravatar via <Image/>, initials
 * fallback), author + date, raw WP HTML body, and the five-criterion
 * star grid. No typography plugin is installed, so the HTML body is
 * styled with arbitrary descendant variants instead of `prose`.
 * Server Component.
 */
export function ReviewCommentItem({ comment }: { comment: ReviewCommentNode }) {
  const { author, reviewRatings } = comment;
  const avatarUrl = author.node.avatar?.url;

  return (
    <article className="grid gap-4 sm:grid-cols-[60px_1fr]">
      <div className="flex h-15 w-15 shrink-0 items-center justify-center overflow-hidden rounded-full bg-subtle">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${author.node.name}'s avatar`}
            width={60}
            height={60}
            sizes="60px"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold text-heading">
            {initialsOf(author.node.name)}
          </span>
        )}
      </div>

      <div className="grid gap-3">
        <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h4 className="text-base font-semibold text-heading">
            {author.node.name}
          </h4>
          <time dateTime={comment.date} className="text-xs text-muted">
            {dateFormatter.format(new Date(comment.date))}
          </time>
        </header>

        <div
          className="max-w-none text-sm leading-relaxed text-body [&_a]:text-primary [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />

        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-3">
          {REVIEW_CRITERIA.map((criterion) => (
            <div
              key={criterion.key}
              className="flex items-center justify-between gap-2"
            >
              <dt className="text-xs text-muted">{criterion.label}</dt>
              <dd>
                <StarRating
                  value={reviewRatings[criterion.ratingKey]}
                  size={14}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}