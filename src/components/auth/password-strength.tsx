import { cn } from "@/lib/utils";

export function scorePassword(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
const colors = ["bg-error", "bg-error", "bg-warning", "bg-info", "bg-success"];

export function PasswordStrength({ password }: { password: string }) {
  const score = scorePassword(password);
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full bg-surface-sunken transition-colors duration-200",
              i < score && colors[score],
            )}
          />
        ))}
      </div>
      <p className="mt-1.5 text-caption text-foreground-subtle">{labels[score]}</p>
    </div>
  );
}
