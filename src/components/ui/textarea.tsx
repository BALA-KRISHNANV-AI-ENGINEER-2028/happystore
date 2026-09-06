import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full rounded-md border bg-surface px-3 py-2 text-body-sm text-foreground placeholder:text-foreground-subtle transition-colors duration-150",
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
Textarea.displayName = "Textarea";
