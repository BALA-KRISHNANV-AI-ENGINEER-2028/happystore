import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ReviewCardProps {
  authorName: string;
  authorInitials: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  className?: string;
}

export function ReviewCard({ authorName, authorInitials, authorAvatar, rating, date, comment, className }: ReviewCardProps) {
  return (
    <div className={cn("flex gap-3 border-b border-border py-4 last:border-0", className)}>
      <Avatar fallback={authorInitials} src={authorAvatar} size="md" />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-body-sm font-medium text-foreground">{authorName}</p>
          <p className="text-caption text-foreground-subtle">{date}</p>
        </div>
        <div className="mt-0.5 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < rating ? "fill-accent text-accent" : "text-border-strong"}
            />
          ))}
        </div>
        <p className="mt-1.5 text-body-sm text-foreground-muted">{comment}</p>
      </div>
    </div>
  );
}
