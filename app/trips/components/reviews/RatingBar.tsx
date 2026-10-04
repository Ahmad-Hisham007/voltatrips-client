/**
 * One criterion row: label above the track, numeric value right-aligned.
 * Value is on the 1–10 display scale (spec.md §6). Server Component.
 */
export function RatingBar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 10) * 100));

  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-heading">{label}</span>
        <span className="text-[13px] font-semibold tabular-nums text-heading">
          {value.toFixed(1)}
        </span>
      </div>
      <div
        role="meter"
        aria-valuenow={Number(value.toFixed(1))}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-label={`${label}: ${value.toFixed(1)} out of 10`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-black/10"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}