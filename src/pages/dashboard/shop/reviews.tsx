import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toaster";
import { shopReviews as seedReviews } from "@/lib/mock-shop-owner";

export default function ShopReviewsPage() {
  const [reviews, setReviews] = useState(seedReviews);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  function submitReply(id: string) {
    const text = drafts[id]?.trim();
    if (!text) return;
    setReviews((current) => current.map((r) => (r.id === id ? { ...r, reply: text } : r)));
    setDrafts((d) => ({ ...d, [id]: "" }));
    toast.success("Reply posted");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-baseline gap-2">
        <h1 className="font-display text-heading-lg font-semibold text-foreground">Reviews</h1>
        <span className="inline-flex items-center gap-1 text-body-sm text-foreground-muted">
          <Star size={14} className="fill-accent text-accent" /> {avgRating.toFixed(1)} average
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-5">
            <div className="flex gap-3">
              <Avatar fallback={review.authorInitials} size="md" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-body-sm font-medium text-foreground">{review.authorName}</p>
                  <p className="text-caption text-foreground-subtle">{review.date}</p>
                </div>
                <div className="mt-0.5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className={i < review.rating ? "fill-accent text-accent" : "text-border-strong"} />
                  ))}
                </div>
                <p className="mt-1.5 text-body-sm text-foreground-muted">{review.comment}</p>

                {review.reply ? (
                  <div className="mt-3 rounded-md bg-surface-sunken p-3">
                    <p className="mb-0.5 text-caption font-medium text-foreground">Your reply</p>
                    <p className="text-body-sm text-foreground-muted">{review.reply}</p>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-col gap-2">
                    <Textarea
                      placeholder="Write a reply…"
                      value={drafts[review.id] ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [review.id]: e.target.value }))}
                      className="min-h-16"
                    />
                    <Button size="sm" variant="secondary" className="self-start" onClick={() => submitReply(review.id)}>
                      <MessageSquare size={13} /> Post reply
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
