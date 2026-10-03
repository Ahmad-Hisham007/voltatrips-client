function ReviewsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading font-display text-2xl lg:text-3xl">
          Reviews
        </h2>
        <p className="mt-1 text-body">
          Join the conversation and share your experience!
        </p>
      </div>

      {/* <ReviewForm /> — import when available */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-center text-muted">
          Review form and review list coming soon.
        </p>
      </div>
    </div>
  );
}

export default ReviewsTab;
