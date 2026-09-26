import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const cx = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/**
 * Shared input primitive. Border color uses the global
 * --color-border token so it stays consistent across forms.
 * Pass `error` to swap the border to --color-error.
 */
export function Input({ error, className, ...rest }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={cx(
          "w-full rounded border border-border bg-surface px-3 py-2 text-base text-body placeholder-muted focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus",
          error ? "border-error" : "",
          className,
        )}
        {...rest}
      />
      {error ? <p className="mt-1 text-sm text-error">{error}</p> : null}
    </div>
  );
}

Input.displayName = "Input";
