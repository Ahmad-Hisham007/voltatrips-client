"use client";

import { Star } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";

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
  /**
   * id of the visible <label> — wired as aria-labelledby on the radiogroup
   * (interactive mode). A radiogroup of buttons cannot use htmlFor, so
   * aria-labelledby is the sanctioned equivalent.
   */
  labelledBy?: string;
  className?: string;
}

/**
 * Read-only star rating by default. Matches the reference's
 * filled = amber (#ff681a) / empty = #959595 scheme.
 *
 * Interactive mode (D1 fix) renders a keyboard-operable radiogroup of
 * real <button type="button" role="radio"> elements — focusable,
 * arrow-navigable, with a hover preview of the value under the cursor.
 * Read-only mode emits the same DOM as before (role="img" + aria-label).
 */
export function StarRating({
  value,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  labelledBy,
  className,
}: StarRatingProps) {
  const safeValue = Math.max(0, Math.min(value, max));
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    const current = buttonsRef.current.indexOf(event.currentTarget);
    if (current === -1) return;

    let next = current;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = Math.min(max - 1, current + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = Math.max(0, current - 1);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = max - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    onChange?.(next + 1);
    buttonsRef.current[next]?.focus();
  };

  // ---- Read-only: unchanged DOM (role="img", non-interactive stars) ----
  if (!interactive) {
    return (
      <div
        className={`inline-flex items-center gap-0.5 cursor-default ${className ?? ""}`}
        role="img"
        aria-label={`Rating: ${safeValue} out of ${max}`}
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
            />
          );
        })}
      </div>
    );
  }

  // ---- Interactive: radiogroup of buttons ----
  // Hover previews the value; the committed value drives aria-checked.
  const displayValue = hoverValue ?? safeValue;

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className ?? ""}`}
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : "Rate this"}
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= displayValue;
        const checked = i + 1 === safeValue;
        // Roving tabindex: the selected star is tabbable; when nothing is
        // selected yet, the first star is, so the group is reachable by Tab.
        const tabbable = checked || (safeValue === 0 && i === 0);
        return (
          <button
            key={i}
            ref={(el) => {
              buttonsRef.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${i + 1} out of ${max}`}
            tabIndex={tabbable ? 0 : -1}
            onClick={() => handleClick(i)}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setHoverValue(i + 1)}
            className="cursor-pointer rounded-sm p-0.5 leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Star
              size={size}
              fill={filled ? "var(--color-primary)" : "none"}
              color={filled ? "var(--color-primary)" : "var(--color-muted)"}
              strokeWidth={1.5}
              className="pointer-events-none"
            />
          </button>
        );
      })}
    </div>
  );
}

StarRating.displayName = "StarRating";
