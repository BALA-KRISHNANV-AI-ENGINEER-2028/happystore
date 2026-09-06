import { Link, useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, Percent, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { ShopCard } from "@/components/commerce/shop-card";
import { ProductCard } from "@/components/commerce/product-card";
import { ReorderCard } from "@/components/commerce/reorder-card";
import { OfferCard } from "@/components/commerce/offer-card";
import { getProductById } from "@/lib/mock-products";
import { toast } from "@/components/ui/toaster";
import { useCart } from "@/lib/cart-context";

function SectionHeader({ title, to }: { title: string; to?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <h2 className="font-display text-heading-sm font-semibold text-foreground">{title}</h2>
      {to && (
        <Button variant="link" size="sm" asChild>
          <Link to={to}>See all <ArrowRight size={13} /></Link>
        </Button>
      )}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  return (
    <div className="flex flex-col gap-10">
      {/* Greeting */}
      <div>
        <p className="inline-flex items-center gap-1.5 text-caption text-foreground-subtle">
          <MapPin size={13} /> Delivering to 214 Maple Street
        </p>
        <h1 className="mt-1 font-display text-heading-lg font-semibold text-foreground">
          Good afternoon, Jordan
        </h1>
        <div className="mt-4 max-w-lg">
          <SearchBar placeholder="Search shops or products" />
        </div>
      </div>

      {/* Order again */}
      <section>
        <SectionHeader title="Order again" to="/orders" />
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <ReorderCard
            shopName="Corner Market"
            itemSummary="Milk, eggs, sourdough +2 more"
            total={24.1}
            lastOrderedAt="3 days ago"
            onReorder={() => toast.success("Added to cart", { description: "4 items from Corner Market" })}
          />
          <ReorderCard
            shopName="Rivera Bakery"
            itemSummary="Sourdough loaf, croissants"
            total={14.25}
            lastOrderedAt="1 week ago"
            onReorder={() => toast.success("Added to cart", { description: "2 items from Rivera Bakery" })}
          />
          <ReorderCard
            shopName="Green Leaf Pharmacy"
            itemSummary="Allergy relief, vitamins"
            total={38.9}
            lastOrderedAt="2 weeks ago"
            onReorder={() => toast.success("Added to cart", { description: "2 items from Green Leaf Pharmacy" })}
          />
        </div>
      </section>

      {/* Saved shops */}
      <section>
        <SectionHeader title="Your saved shops" to="/wishlist" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ShopCard name="Corner Market" category="Grocery · Convenience" rating={4.8} reviewCount={212} distance="0.4 mi" onClick={() => navigate("/shops/corner-market")} />
          <ShopCard name="Rivera Bakery" category="Bakery · Cafe" rating={4.6} reviewCount={98} distance="0.7 mi" onClick={() => navigate("/shops/rivera-bakery")} />
        </div>
      </section>

      {/* Picked for you */}
      <section>
        <SectionHeader title="Picked for you" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {["milk-1gal", "sourdough-loaf", "cold-brew", "croissant-4pk"].map((id) => {
            const product = getProductById(id)!;
            return (
              <ProductCard
                key={product.id}
                name={product.name}
                shopName={product.shopName}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                unit={product.unit}
                onClick={() => navigate(`/products/${product.id}`)}
                onAdd={() => {
                  addItem({
                    productId: product.id,
                    name: product.name,
                    shopId: product.shopId,
                    shopName: product.shopName,
                    price: product.price,
                    unit: product.unit,
                  });
                  toast.success("Added to cart", { description: product.name });
                }}
              />
            );
          })}
        </div>
      </section>

      {/* Offers for you */}
      <section>
        <SectionHeader title="Offers for you" to="/offers" />
        <div className="grid gap-4 sm:grid-cols-3">
          <OfferCard icon={Percent} title="15% off Corner Market" description="Valid on your next order over $20." code="MARKET15" tone="accent" />
          <OfferCard icon={Gift} title="Free item at Rivera Bakery" description="Spend $25, get a free pastry." tone="primary" />
          <OfferCard icon={Sparkles} title="New shop nearby" description="Green Leaf Pharmacy just joined Happy Store." tone="accent" />
        </div>
      </section>
    </div>
  );
}
