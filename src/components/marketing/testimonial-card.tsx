import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export interface TestimonialCardProps {
  quote: string;
  name: string;
  initials: string;
  role: string;
  rating: number;
}

export function TestimonialCard({ quote, name, initials, role, rating }: TestimonialCardProps) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-surface p-6">
      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className={i < rating ? "fill-accent text-accent" : "text-border-strong"} />
        ))}
      </div>
      <p className="flex-1 text-body-sm text-foreground-muted">&ldquo;{quote}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3">
        <Avatar fallback={initials} size="md" />
        <div>
          <p className="text-body-sm font-medium text-foreground">{name}</p>
          <p className="text-caption text-foreground-subtle">{role}</p>
        </div>
      </div>
    </div>
  );
}
