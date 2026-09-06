import { Drawer as DrawerPrimitive } from "vaul";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Drawer = DrawerPrimitive.Root;
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerClose = DrawerPrimitive.Close;
export const DrawerPortal = DrawerPrimitive.Portal;

export function DrawerOverlay({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return <DrawerPrimitive.Overlay className={cn("fixed inset-0 z-50 bg-black/40", className)} {...props} />;
}

export function DrawerContent({ className, children, ...props }: ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col rounded-t-xl border-t border-border bg-surface shadow-lg",
          className,
        )}
        {...props}
      >
        <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-border-strong" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

export function DrawerHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1 p-5 pb-2 text-left", className)} {...props} />;
}

export function DrawerTitle({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn("font-display text-heading-sm font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function DrawerDescription({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Description>) {
  return <DrawerPrimitive.Description className={cn("text-body-sm text-foreground-muted", className)} {...props} />;
}

export function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-auto flex flex-col gap-2 p-5 pt-2", className)} {...props} />;
}
