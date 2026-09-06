import { useState } from "react";
import { Percent, Gift, Sparkles, Truck, Tag } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { OfferCard } from "@/components/commerce/offer-card";
import { EmptyState } from "@/components/ui/empty-state";

const filters = ["All", "Groceries", "Bakery", "Pharmacy", "New shops"] as const;

const offers = [
  { id: 1, icon: Percent, title: "15% off Corner Market", description: "Valid on your next order over $20.", code: "MARKET15", tone: "accent" as const, category: "Groceries" },
  { id: 2, icon: Gift, title: "Free item at Rivera Bakery", description: "Spend $25, get a free pastry.", tone: "primary" as const, category: "Bakery" },
  { id: 3, icon: Sparkles, title: "New shop nearby", description: "Green Leaf Pharmacy just joined Happy Store.", tone: "accent" as const, category: "New shops" },
  { id: 4, icon: Truck, title: "Free delivery over $35", description: "Stack it with any other offer, storewide.", tone: "primary" as const, category: "Groceries" },
  { id: 5, icon: Tag, title: "20% off pharmacy essentials", description: "This week only at Green Leaf Pharmacy.", code: "HEALTH20", tone: "accent" as const, category: "Pharmacy" },
  { id: 6, icon: Gift, title: "Refer a neighbor", description: "You both get $10 credit on their first order.", code: "INVITE10", tone: "primary" as const, category: "New shops" },
];

export default function OffersPage() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const visible = active === "All" ? offers : offers.filter((o) => o.category === active);

  return (
    <div>
      <h1 className="mb-1 font-display text-heading-lg font-semibold text-foreground">Offers for you</h1>
      <p className="mb-6 text-body-sm text-foreground-muted">Personalized deals from shops near 214 Maple Street.</p>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Chip key={filter} selected={active === filter} onClick={() => setActive(filter)}>
            {filter}
          </Chip>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={<Tag size={20} />} title="No offers in this category yet" description="Check back soon, or browse all offers." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((offer) => (
            <OfferCard key={offer.id} icon={offer.icon} title={offer.title} description={offer.description} code={offer.code} tone={offer.tone} />
          ))}
        </div>
      )}
    </div>
  );
}
