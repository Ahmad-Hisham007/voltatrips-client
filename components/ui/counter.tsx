"use client";

import { Minus, Plus } from "lucide-react";

export interface CounterProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  label?: string;
  className?: string;
}

/**
 * +/- stepper. Used in the sidebar booking form for adult/child/infant
 * counts. Mirrors the reference guest-counter interaction.
 */
export function Counter({
  value,
  min = 0,
  max = 20,
  step = 1,
  onChange,
  label,
  className,
}: CounterProps) {
  const decrement = () => onChange?.(Math.max(min, value - step));
  const increment = () => onChange?.(Math.min(max, value + step));

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      {label ? (
        <span className="text-sm text-muted">{label}</span>
      ) : null}
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease"
        className="rounded border border-border p-1 text-body hover:bg-surface disabled:opacity-50"
      >
        <Minus size={14} />
      </button>
      <span
        aria-label={label ? `${label}: ${value}` : "Count"}
        className="tabular-nums text-sm font-medium text-body w-6 text-center"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        aria-label="Increase"
        className="rounded border border-border p-1 text-body hover:bg-surface disabled:opacity-50"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

Counter.displayName = "Counter";
