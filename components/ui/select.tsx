import { useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const cx = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/**
 * Thin native-styled <select> wrapper. The reference uses styled
 * selects for time slots & categories; this matches that look with
 * the global border token + chevron icon.
 */
export function Select({ label, error, className, id, ...rest }: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? `select-${generatedId}`;
  return (
    <div className={cx("relative w-full", className)}>
      {label ? (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-heading mb-1"
        >
          {label}
        </label>
      ) : null}
      <select
        id={fieldId}
        className={cx(
          "w-full appearance-none rounded border border-border bg-surface px-3 py-2 pr-10 text-base text-body placeholder-muted focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus",
          error ? "border-error" : "",
        )}
        {...rest}
      />
      <ChevronDown
        size={16}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-body/50 pointer-events-none"
      />
      {error ? <p className="mt-1 text-sm text-error">{error}</p> : null}
    </div>
  );
}

Select.displayName = "Select";
