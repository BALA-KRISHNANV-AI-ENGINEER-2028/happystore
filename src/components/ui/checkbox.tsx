import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import type { ComponentProps } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "h-5 w-5 shrink-0 rounded-sm border border-border-strong bg-surface transition-colors duration-150",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        "focus-visible:outline-none focus-visible:shadow-focus",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-foreground-on-primary">
        <Check size={14} strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
