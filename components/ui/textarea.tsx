import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const cx = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/**
 * Shared textarea primitive. Border color uses the global
 * --color-border token; error state swaps to --color-error.
 */
export function Textarea({
  error,
  className,
  ...rest
}: TextareaProps) {
  return (
    <div className="w-full">
      <textarea
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

Textarea.displayName = "Textarea";
