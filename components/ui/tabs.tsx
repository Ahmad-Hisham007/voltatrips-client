import * as RadixTabs from "@radix-ui/react-tabs";
import type { ComponentProps } from "react";

const cx = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/**
 * Tabs wrapping Radix Tabs. Matches the reference mkdf-tabs layout:
 * vertical tab list on desktop, top-stacked on mobile. Content swaps
 * in the main area while the right rail (booking sidebar) is rendered
 * as a sibling outside these tabs by the page.
 */
export function Tabs({
  className,
  children,
  ...rest
}: ComponentProps<typeof RadixTabs.Root>) {
  return (
    <RadixTabs.Root className={cx("w-full", className)} {...rest}>
      {children}
    </RadixTabs.Root>
  );
}

export function TabsList({
  className,
  children,
  ...rest
}: ComponentProps<typeof RadixTabs.List>) {
  return (
    <RadixTabs.List
      className={cx(
        "flex flex-col sm:flex-row sm:gap-0 border-b border-border sm:border-b-0 sm:border-r sm:border-border bg-surface p-1.5 sm:p-0 rounded-t sm:rounded-t-none sm:rounded-l mb-0 sm:mb-6",
        className,
      )}
      {...rest}
    >
      {children}
    </RadixTabs.List>
  );
}

export function TabsTrigger({
  className,
  children,
  ...rest
}: ComponentProps<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      className={cx(
        "px-4 py-2 text-sm font-medium rounded-t hover:text-body  whitespace-nowrap",
        className,
      )}
      {...rest}
    >
      {children}
    </RadixTabs.Trigger>
  );
}

export function TabsContent({
  className,
  children,
  ...rest
}: ComponentProps<typeof RadixTabs.Content>) {
  return (
    <RadixTabs.Content className={cx("mt-0", className)} {...rest}>
      {children}
    </RadixTabs.Content>
  );
}

Tabs.displayName = "Tabs";
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";
