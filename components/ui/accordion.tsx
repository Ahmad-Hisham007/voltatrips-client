"use client";

import * as RadixAccordion from "@radix-ui/react-accordion";
import type { AccordionMultipleProps } from "@radix-ui/react-accordion";
import type { ComponentProps } from "react";
import { Plus } from "lucide-react";

const cx = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/**
 * Accordion matching the reference Tour Plan tab: day-by-day items
 * with a chevron/plus indicator, expandable per day.
 */
export function Accordion({
  className,
  children,
  ...rest
}: Omit<AccordionMultipleProps, "type">) {
  return (
    <RadixAccordion.Root
      type="multiple"
      className={cx("w-full", className)}
      {...rest}
    >
      {children}
    </RadixAccordion.Root>
  );
}

export function AccordionItem({
  className,
  children,
  ...rest
}: ComponentProps<typeof RadixAccordion.Item>) {
  return (
    <RadixAccordion.Item
      className={cx(
        "border-b border-border/50 last:border-0",
        className,
      )}
      {...rest}
    >
      {children}
    </RadixAccordion.Item>
  );
}

const accordionTriggerBase =
  "flex w-full items-center justify-between text-left font-medium text-heading hover:text-primary transition-colors";

export function AccordionTrigger({
  className,
  children,
  ...rest
}: ComponentProps<typeof RadixAccordion.Trigger>) {
  return (
    <RadixAccordion.Trigger className={cx(accordionTriggerBase, className)} {...rest}>
      <span>{children}</span>
      <Plus
        size={16}
        className="ml-auto shrink-0 transition-transform duration-200 ui-state-open:rotate-45"
      />
    </RadixAccordion.Trigger>
  );
}

export function AccordionContent({
  className,
  children,
  ...rest
}: ComponentProps<typeof RadixAccordion.Content>) {
  return (
    <RadixAccordion.Content
      className={cx(
        "overflow-hidden text-sm text-body transition-all",
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className,
      )}
      {...rest}
    >
      {children}
    </RadixAccordion.Content>
  );
}

Accordion.displayName = "Accordion";
AccordionItem.displayName = "AccordionItem";
AccordionTrigger.displayName = "AccordionTrigger";
AccordionContent.displayName = "AccordionContent";
