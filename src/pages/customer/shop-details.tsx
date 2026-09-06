import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Star, Store, Clock, MapPin, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { ProximityChip } from "@/components/ui/proximity-chip";
import { ProductCard } from "@/components/commerce/product-card";
import { ReviewCard } from "@/components/commerce/review-card";
import { getShopById } from "@/lib/mock-shops";
import { mockProducts } from "@/lib/mock-products";
import { toast } from "@/components/ui/toaster";
import { useCart } from "@/lib/cart-context";
import { useSocket } from "@/hooks/useSocket";
import { cn } from "@/lib/utils";

function RatingBar({ stars, percent }: { stars: number; percent: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-10 shrink-0 text-caption text-foreground-subtle">{stars} star</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
        <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-9 shrink-0 text-right text-caption text-foreground-subtle">{percent}%</span>
    </div>
  );
}

export default function ShopDetailsPage() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const shop = shopId ? getShopById(shopId) : undefined;
  const [saved, setSaved] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "shop"; text: string; time: string }>>([
    { sender: "shop", text: "Hello! How can we help you today?", time: "Just now" },
  ]);

  const { addItem } = useCart();
  const { isConnected, sendMessage } = useSocket({
    namespace: "/chat",
    userId: "cust_demo_1",
    role: "CUSTOMER",
    autoConnect: chatOpen,
  });

  if (!shop) {
    return (
      <EmptyState
        icon={<Store size={20} />}
        title="Shop not found"
        description="It may have moved or is no longer available."
        action={<Button variant="secondary" size="sm" onClick={() => navigate("/shops")}>Back to shops</Button>}
      />
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    const newMsg = { sender: "user" as const, text: chatText.trim(), time: "Just now" };
    setMessages((prev) => [...prev, newMsg]);

    sendMessage("message:send", {
      conversationId: `conv_${shop.id}`,
      text: chatText.trim(),
      fromShop: false,
    });

    setChatText("");

    // Simulate instant friendly shop response if socket isn't echoing back
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "shop",
          text: `Thanks for contacting ${shop.name}! Our team will respond shortly.`,
          time: "Just now",
        },
      ]);
    }, 1200);
  };

  return (
    <div>
      <button
        onClick={() => navigate("/shops")}
        className="mb-5 inline-flex items-center gap-1.5 text-body-sm font-medium text-foreground-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to shops
      </button>

      {/* Cover */}
      <div className="mb-5 h-40 w-full rounded-lg bg-surface-sunken sm:h-56" />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-heading-lg font-semibold text-foreground">{shop.name}</h1>
            {shop.promoted && <Badge tone="accent">Promoted</Badge>}
          </div>
          <p className="mt-1 text-body-sm text-foreground-subtle">{shop.category}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 text-body-sm font-medium text-foreground">
              <Star size={14} className="fill-accent text-accent" /> {shop.rating.toFixed(1)}
              <span className="font-normal text-foreground-subtle">({shop.reviewCount} reviews)</span>
            </span>
            <ProximityChip distance={shop.distance} open={shop.open} />
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            variant={saved ? "primary" : "outline"}
            size="md"
            onClick={() => {
              setSaved((s) => !s);
              toast(saved ? `Removed ${shop.name} from saved shops` : `Saved ${shop.name}`);
            }}
          >
            <Heart size={15} className={cn(saved && "fill-current")} /> {saved ? "Saved" : "Save"}
          </Button>
          <Button variant="secondary" size="md" onClick={() => setChatOpen(true)}>
            <MessageCircle size={15} /> Message
          </Button>
        </div>
      </div>

      {/* Real-time Chat Drawer / Modal */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[480px] w-96 flex-col rounded-2xl border border-border bg-surface shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4 bg-surface-elevated rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-body-sm font-semibold text-primary">
                  {shop.name.charAt(0)}
                </div>
                <span className={cn("absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface", isConnected ? "bg-emerald-500" : "bg-amber-500")} />
              </div>
              <div>
                <h4 className="font-display text-body-sm font-semibold text-foreground">{shop.name}</h4>
                <p className="text-caption text-foreground-subtle">{isConnected ? "Live Chat Connected" : "Connecting..."}</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="rounded-lg p-1 text-foreground-subtle hover:bg-surface-sunken hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-body-sm shadow-sm",
                  m.sender === "user"
                    ? "self-end bg-primary text-foreground-on-primary rounded-br-none"
                    : "self-start bg-surface-sunken text-foreground rounded-bl-none"
                )}
              >
                <p>{m.text}</p>
                <span className="mt-1 block text-right text-[10px] opacity-70">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-border p-3">
            <input
              type="text"
              placeholder="Ask about items, delivery..."
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-surface p-2.5 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button type="submit" size="sm" className="rounded-xl px-3.5">
              <Send size={15} />
            </Button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="products" className="mt-8">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({shop.reviewCount})</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {mockProducts.filter((p) => p.shopId === shop.id).map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                shopName={shop.name}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                unit={product.unit}
                outOfStock={product.outOfStock}
                onClick={() => navigate(`/products/${product.id}`)}
                onAdd={() => {
                  addItem({
                    productId: product.id,
                    name: product.name,
                    shopId: product.shopId,
                    shopName: shop.name,
                    price: product.price,
                    unit: product.unit,
                  });
                  toast.success("Added to cart", { description: product.name });
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-display-sm font-semibold text-foreground">{shop.rating.toFixed(1)}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < Math.round(shop.rating) ? "fill-accent text-accent" : "text-border-strong"} />
                  ))}
                </div>
              </div>
              <p className="mb-4 text-caption text-foreground-subtle">{shop.reviewCount} reviews</p>
              <div className="flex flex-col gap-2">
                {shop.ratingBreakdown.map((percent, i) => (
                  <RatingBar key={i} stars={5 - i} percent={percent} />
                ))}
              </div>
            </div>
            <div>
              {shop.reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  authorName={review.authorName}
                  authorInitials={review.authorInitials}
                  rating={review.rating}
                  date={review.date}
                  comment={review.comment}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="about">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 font-display text-body font-semibold text-foreground">About {shop.name}</h3>
              <p className="text-body-sm text-foreground-muted">{shop.description}</p>
              <p className="mt-4 inline-flex items-start gap-1.5 text-body-sm text-foreground-muted">
                <MapPin size={15} className="mt-0.5 shrink-0" /> {shop.address}
              </p>
            </div>
            <div>
              <h3 className="mb-2 inline-flex items-center gap-1.5 font-display text-body font-semibold text-foreground">
                <Clock size={15} /> Hours
              </h3>
              <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
                {shop.hours.map((h) => (
                  <div key={h.day} className="flex justify-between px-3 py-2 text-body-sm">
                    <span className="text-foreground-muted">{h.day}</span>
                    <span className="font-medium text-foreground">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <p className="mt-10 text-center text-caption text-foreground-subtle">
        Looking for something else? <Link to="/shops" className="text-primary hover:underline">Browse all shops</Link>
      </p>
    </div>
  );
}
