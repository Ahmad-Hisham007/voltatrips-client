import type { ReviewCommentNode } from "@/types/review";
import { ReviewCommentItem } from "./ReviewCommentItem";

/**
 * Newest-first list of approved reviews with hairline dividers between
 * items (last item undivided). Server Component.
 */
export function ReviewList({ comments }: { comments: ReviewCommentNode[] }) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-body">
        No reviews yet. Be the first to share your experience!
      </p>
    );
  }

  return (
    <div>
      {comments.map((comment, index) => (
        <div
          key={comment.databaseId}
          className={
            index < comments.length - 1
              ? "mb-8 border-b border-border pb-8"
              : undefined
          }
        >
          <ReviewCommentItem comment={comment} />
        </div>
      ))}
    </div>
  );
}