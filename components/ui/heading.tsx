import type { ComponentProps } from "react";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type TextLevel = "p" | "span";
export type HeadingAs = HeadingLevel | TextLevel;

export type HeadingProps = ComponentProps<HeadingLevel> & {
  as?: HeadingAs;
};

const cx = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const baseHeadingClass = "font-display text-heading m-0";
const baseTextClass = "text-body m-0";

/**
 * Semantic heading/text component backed by the Playfair Display scale
 * declared in app/globals.css (h1 75px … h6 17px).
 * Swap --font-display in globals.css to re-theme site-wide.
 */
export function Heading({
  as = "h2",
  className,
  children,
  ...rest
}: HeadingProps) {
  const classes =
    as === "p" || as === "span"
      ? cx(baseTextClass, className)
      : cx(baseHeadingClass, className);

  switch (as) {
    case "h1":
      return (
        <h1 className={classes} {...rest}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 className={classes} {...rest}>
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 className={classes} {...rest}>
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 className={classes} {...rest}>
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5 className={classes} {...rest}>
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6 className={classes} {...rest}>
          {children}
        </h6>
      );
    case "p":
      return (
        <p className={classes} {...rest}>
          {children}
        </p>
      );
    case "span":
      return (
        <span className={classes} {...rest}>
          {children}
        </span>
      );
    default:
      return (
        <h2 className={classes} {...rest}>
          {children}
        </h2>
      );
  }
}

Heading.displayName = "Heading";
