import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Minus, Plus, Star, Store, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/commerce/product-card";
import { getProductById, getRelatedProducts } from "@/lib/mock-products";
import { toast } from "@/components/ui/toaster";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = productId ? getProductById(productId) : undefined;
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);
  const { addItem } = useCart();

  if (!product) {
    return (
      <EmptyState
        icon={<PackageX size={20} />}
        title="Product not found"
        description="It may have been removed or is no longer available."
        action={<Button variant="secondary" size="sm" onClick={() => navigate("/categories")}>Browse categories</Button>}
      />
    );
  }

  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const related = getRelatedProducts(product);

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-5 inline-flex items-center gap-1.5 text-body-sm font-medium text-foreground-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative h-72 w-full rounded-lg bg-surface-sunken sm:h-96">
          {onSale && <Badge tone="error" className="absolute left-3 top-3">Sale</Badge>}
          {product.outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-surface/70 backdrop-blur-[1px]">
              <Badge tone="neutral">Out of stock</Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <Link to={`/shops/${product.shopId}`} className="inline-flex items-center gap-1.5 text-body-sm font-medium text-primary hover:underline">
            <Store size={14} /> {product.shopName}
          </Link>
          <h1 className="mt-2 font-display text-heading-lg font-semibold text-foreground">{product.name}</h1>

          <div className="mt-2 flex items-center gap-1.5 text-body-sm text-foreground-muted">
            <Star size={14} className="fill-accent text-accent" />
            <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
            ({product.reviewCount} reviews)
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-heading-md font-semibold text-foreground">${product.price.toFixed(2)}</span>
            {onSale && (
              <span className="font-mono text-body text-foreground-subtle line-through">
                ${product.compareAtPrice!.toFixed(2)}
              </span>
            )}
            {product.unit && <span className="text-body-sm text-foreground-subtle">/{product.unit}</span>}
          </div>

          <p className="mt-4 text-body-sm text-foreground-muted">{product.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-border-strong">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={product.outOfStock}
                aria-label="Decrease quantity"
                className="flex h-10 w-10 items-center justify-center text-foreground-muted hover:text-foreground disabled:opacity-40"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-mono text-body-sm font-medium text-foreground">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                disabled={product.outOfStock}
                aria-label="Increase quantity"
                className="flex h-10 w-10 items-center justify-center text-foreground-muted hover:text-foreground disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={product.outOfStock}
              onClick={() => {
                addItem(
                  {
                    productId: product.id,
                    name: product.name,
                    shopId: product.shopId,
                    shopName: product.shopName,
                    price: product.price,
                    unit: product.unit,
                  },
                  qty,
                );
                toast.success("Added to cart", { description: `${qty} × ${product.name}` });
              }}
            >
              {product.outOfStock ? "Out of stock" : `Add to cart · $${(product.price * qty).toFixed(2)}`}
            </Button>

            <Button
              variant={saved ? "primary" : "outline"}
              size="lg"
              onClick={() => {
                setSaved((s) => !s);
                toast(saved ? "Removed from wishlist" : "Saved to wishlist");
              }}
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            >
              <Heart size={16} className={cn(saved && "fill-current")} />
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-heading-sm font-semibold text-foreground">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                name={p.name}
                shopName={p.shopName}
                price={p.price}
                compareAtPrice={p.compareAtPrice}
                unit={p.unit}
                outOfStock={p.outOfStock}
                onClick={() => navigate(`/products/${p.id}`)}
                onAdd={() => {
                  addItem({
                    productId: p.id,
                    name: p.name,
                    shopId: p.shopId,
                    shopName: p.shopName,
                    price: p.price,
                    unit: p.unit,
                  });
                  toast.success("Added to cart", { description: p.name });
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
