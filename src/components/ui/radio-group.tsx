import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const RadioGroup = RadioGroupPrimitive.Root;

export function RadioGroupItem({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface transition-colors",
        "data-[state=checked]:border-primary",
        "focus-visible:outline-none focus-visible:shadow-focus",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="h-2.5 w-2.5 rounded-full bg-primary" />
    </RadioGroupPrimitive.Item>
  );
}
