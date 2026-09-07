import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  className?: string;
}

/**
 * Accessible Light / Dark Theme Switcher
 * Reuses the existing ThemeProvider and useTheme() hook from @/lib/theme.
 * Instantly toggles between light and dark themes, persisting via localStorage.
 */
export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { resolvedTheme, setPreference } = useTheme();

  return (
    <div
      role="group"
      aria-label="Theme switcher"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-surface/90 p-1 shadow-xs backdrop-blur-md transition-colors duration-200",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setPreference("light")}
        aria-label="Switch to light theme"
        aria-pressed={resolvedTheme === "light"}
        title="Light theme"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface",
          resolvedTheme === "light"
            ? "bg-primary text-foreground-on-primary shadow-xs font-semibold"
            : "text-foreground-muted hover:bg-surface-sunken hover:text-foreground",
        )}
      >
        <Sun size={14} className="stroke-[2.25]" />
        <span className="text-xs font-medium">Light</span>
      </button>

      <button
        type="button"
        onClick={() => setPreference("dark")}
        aria-label="Switch to dark theme"
        aria-pressed={resolvedTheme === "dark"}
        title="Dark theme"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface",
          resolvedTheme === "dark"
            ? "bg-primary text-foreground-on-primary shadow-xs font-semibold"
            : "text-foreground-muted hover:bg-surface-sunken hover:text-foreground",
        )}
      >
        <Moon size={14} className="stroke-[2.25]" />
        <span className="text-xs font-medium">Dark</span>
      </button>
    </div>
  );
}
