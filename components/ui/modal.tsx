"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

const cx = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/**
 * Modal (Radix Dialog) for the gallery lightbox + any future
 * slideovers. Close icon + aria labels baked in.
 */
export function Modal({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <RadixDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {children}
    </RadixDialog.Root>
  );
}

export function ModalTrigger({
  className,
  children,
  ...rest
}: ComponentProps<typeof RadixDialog.Trigger>) {
  return (
    <RadixDialog.Trigger className={cx("cursor-pointer", className)} {...rest}>
      {children}
    </RadixDialog.Trigger>
  );
}

export function ModalContent({
  className,
  children,
  ...rest
}: ComponentProps<typeof RadixDialog.Content>) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay
        className={cx(
          "fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        )}
      />
      <RadixDialog.Content
        className={cx(
          "fixed top-1/2 left-1/2 z-50 grid w-11/12 max-w-3xl translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-surface p-0 shadow-xl focus:outline-none rounded-lg sm:w-full data-[state=open]:animate-modal-show",
          className,
        )}
        {...rest}
      >
        {children}
        <RadixDialog.Close
          className={cx(
            "absolute top-3 right-3 rounded p-1 text-body hover:bg-surface-hover hover:text-body",
          )}
          aria-label="Close"
        >
          <X size={18} />
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export function ModalTitle({
  className,
  children,
  ...rest
}: ComponentProps<typeof RadixDialog.Title>) {
  return (
    <RadixDialog.Title
      className={cx("text-lg font-semibold text-heading", className)}
      {...rest}
    >
      {children}
    </RadixDialog.Title>
  );
}

export function ModalDescription({
  className,
  children,
  ...rest
}: ComponentProps<typeof RadixDialog.Description>) {
  return (
    <RadixDialog.Description
      className={cx("text-sm text-body/80", className)}
      {...rest}
    >
      {children}
    </RadixDialog.Description>
  );
}

Modal.displayName = "Modal";
ModalTrigger.displayName = "ModalTrigger";
ModalContent.displayName = "ModalContent";
ModalTitle.displayName = "ModalTitle";
ModalDescription.displayName = "ModalDescription";
