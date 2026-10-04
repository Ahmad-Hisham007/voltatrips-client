/**
 * Exact replica of the Rating Bar from the reference screenshot.
 * Labels and score values are rendered inside the orange bar container.
 */
export function RatingBar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 10) * 100));

  return (
    <div
      role="meter"
      aria-valuenow={Number(value.toFixed(1))}
      aria-valuemin={0}
      aria-valuemax={10}
      aria-label={`${label}: ${value.toFixed(1)} out of 10`}
      className="relative h-7 w-full overflow-hidden rounded-none bg-primary/30"
    >
      {/* Orange filled bar */}
      <div
        className="flex h-full items-center justify-between bg-primary px-3.5 text-xs font-medium text-white transition-[width] duration-700 ease-out"
        style={{ width: `${pct}%` }}
      >
        <span className="truncate">{label}</span>
        <span className="ml-2 font-semibold tabular-nums">
          {value.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
