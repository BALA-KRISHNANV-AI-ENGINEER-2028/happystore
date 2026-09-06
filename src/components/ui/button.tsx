import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-label font-medium transition-colors duration-150 ease-standard disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-foreground-on-primary hover:bg-primary-strong active:bg-primary-strong shadow-sm",
        accent:
          "bg-accent text-foreground-on-accent hover:bg-accent-strong active:bg-accent-strong shadow-sm",
        secondary:
          "bg-surface-sunken text-foreground border border-border hover:bg-surface hover:border-border-strong",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:bg-surface-sunken",
        ghost: "bg-transparent text-foreground-muted hover:bg-surface-sunken hover:text-foreground",
        destructive: "bg-error text-white hover:bg-error-600 shadow-sm",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-label",
        md: "h-10 px-4 text-body-sm",
        lg: "h-12 px-6 text-body",
        icon: "h-10 w-10 shrink-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";
