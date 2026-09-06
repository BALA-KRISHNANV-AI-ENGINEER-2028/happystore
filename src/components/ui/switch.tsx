import * as SwitchPrimitive from "@radix-ui/react-switch";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full bg-surface-sunken border border-border-strong transition-colors",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        "focus-visible:outline-none focus-visible:shadow-focus",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block h-4 w-4 translate-x-0.5 rounded-full bg-surface shadow-sm transition-transform",
          "data-[state=checked]:translate-x-[1.375rem] data-[state=checked]:bg-white",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
