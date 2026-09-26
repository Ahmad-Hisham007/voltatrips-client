import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded disabled:opacity-50 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-content hover:bg-primary/90",
  secondary:
    "bg-secondary text-secondary-content hover:bg-secondary/90",
  ghost:
    "bg-transparent text-body hover:bg-surface/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

/**
 * Uses the global color token variables (--color-primary, etc.)
 * defined in app/globals.css so re-theming is a single-value change.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className ?? ""}`}
      {...rest}
    />
  );
}

Button.displayName = "Button";
