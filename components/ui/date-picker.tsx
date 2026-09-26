"use client";

import { useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface DatePickerProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const cx = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/**
 * Lightweight <input type="date"> wrapper. The reference uses a
 * jQuery datepicker with a #fff surface and #303030 accent header
 * (#ff681a bg). Native date input matches the field model now;
 * a styled calendar can drop in later without API changes.
 */
export function DatePicker({ label, error, className, id, ...rest }: DatePickerProps) {
  const generatedId = useId();
  const fieldId = id ?? `date-${generatedId}`;
  return (
    <div className={cx("w-full", className)}>
      {label ? (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-heading mb-1"
        >
          {label}
        </label>
      ) : null}
      <input
        id={fieldId}
        type="date"
        className={cx(
          "w-full rounded border border-border bg-surface px-3 py-2 text-base text-body placeholder-muted focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus",
          error ? "border-error" : "",
        )}
        {...rest}
      />
      {error ? <p className="mt-1 text-sm text-error">{error}</p> : null}
    </div>
  );
}

DatePicker.displayName = "DatePicker";
