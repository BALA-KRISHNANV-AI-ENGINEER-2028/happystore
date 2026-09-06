import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border bg-surface px-3 text-body-sm text-foreground placeholder:text-foreground-subtle transition-colors duration-150",
        "focus-visible:outline-none focus-visible:border-primary",
        invalid ? "border-error" : "border-border-strong",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      aria-invalid={invalid}
      {...props}
    />
  ),
);
Input.displayName = "Input";
