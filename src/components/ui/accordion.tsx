import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b border-border", className)} {...props} />;
}

export function AccordionTrigger({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 py-4 text-left text-body-sm font-medium text-foreground transition-colors hover:text-primary",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown size={16} className="shrink-0 text-foreground-subtle transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden text-body-sm text-foreground-muted data-[state=open]:animate-[accordion-down_200ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-out]"
      {...props}
    >
      <div className={cn("pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
