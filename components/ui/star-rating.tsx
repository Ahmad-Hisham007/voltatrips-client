import { Star } from "lucide-react";

export interface StarRatingProps {
  /** 0–5 (or 0–max). Half steps are supported. */
  value: number;
  /** Max stars to render. Default 5. */
  max?: number;
  /** Visual size. Maps to lucide icon size. */
  size?: number;
  /** If true, stars are interactive (click to rate). */
  interactive?: boolean;
  /** Controlled change handler — required when interactive. */
  onChange?: (value: number) => void;
  className?: string;
}

/**
 * Read-only star rating by default. Matches the reference's
 * filled = amber (#ff681a) / empty = #959595 scheme.
 * Interactive mode swaps to pointer cursor + click handler.
 */
export function StarRating({
  value,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const safeValue = Math.max(0, Math.min(value, max));

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${
        interactive ? "cursor-pointer" : "cursor-default"
      } ${className ?? ""}`}
      role={interactive ? "radiogroup" : "img"}
      aria-label={
        interactive ? "Rate this" : `Rating: ${safeValue} out of ${max}`
      }
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= safeValue;
        return (
          <Star
            key={i}
            size={size}
            fill={filled ? "currentColor" : "none"}
            color={filled ? "var(--color-primary)" : "var(--color-muted)"}
            strokeWidth={1.5}
            onClick={() => handleClick(i)}
          />
        );
      })}
    </div>
  );
}

StarRating.displayName = "StarRating";
