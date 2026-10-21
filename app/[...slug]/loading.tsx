/**
 * Loading skeleton for the catch-all route.
 * Mirrors the two-column layout structure (hero + tabs + content + sidebar).
 */
export default function Loading() {
  return (
    <div className="flex flex-col">
      {/* Hero carousel placeholder */}
      <div className="aspect-video w-full bg-subtle animate-pulse rounded-b-2xl" />

      {/* Tabs bar placeholder */}
      <div className="flex gap-2 p-4 bg-gray-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-10 flex-1 bg-subtle animate-pulse rounded"
          />
        ))}
      </div>

      {/* Content + sidebar grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 pb-27.5 max-w-325 mx-auto pt-10">
        <div className="lg:col-span-9 px-5 space-y-4">
          <div className="h-4 bg-subtle animate-pulse rounded w-3/4" />
          <div className="h-4 bg-subtle animate-pulse rounded" />
          <div className="h-4 bg-subtle animate-pulse rounded w-5/6" />
          <div className="h-4 bg-subtle animate-pulse rounded" />
          <div className="h-4 bg-subtle animate-pulse rounded w-2/3" />
        </div>
        <aside className="lg:col-span-3 px-5 mt-5">
          <div className="h-[360px] bg-subtle animate-pulse rounded sticky top-24" />
        </aside>
      </div>
    </div>
  );
}
