import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart, groupCartByShop } from "@/lib/cart-context";

const DELIVERY_FEE = 3.99;
const FREE_DELIVERY_THRESHOLD = 35;
const TAX_RATE = 0.08;

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const groups = groupCartByShop(items);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart size={20} />}
        title="Your cart is empty"
        description="Add items from nearby shops to see them here."
        action={<Button variant="secondary" size="sm" asChild><Link to="/shops">Browse shops</Link></Button>}
      />
    );
  }

  const deliveryFee = groups.reduce(
    (sum, g) => sum + (g.items.reduce((s, i) => s + i.price * i.quantity, 0) >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE),
    0,
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + deliveryFee + tax;

  return (
    <div>
      <h1 className="mb-6 font-display text-heading-lg font-semibold text-foreground">Your cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          {groups.map((group) => {
            const groupSubtotal = group.items.reduce((s, i) => s + i.price * i.quantity, 0);
            const freeDelivery = groupSubtotal >= FREE_DELIVERY_THRESHOLD;
            return (
              <Card key={group.shopId} className="p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <Link
                    to={`/shops/${group.shopId}`}
                    className="inline-flex items-center gap-1.5 text-body-sm font-medium text-foreground hover:text-primary"
                  >
                    <Store size={14} /> {group.shopName}
                  </Link>
                  <span className="text-caption text-foreground-subtle">
                    {freeDelivery ? "Free delivery" : `+$${DELIVERY_FEE.toFixed(2)} delivery`}
                  </span>
                </div>

                <div className="flex flex-col divide-y divide-border">
                  {group.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="h-14 w-14 shrink-0 rounded-md bg-surface-sunken" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-body-sm font-medium text-foreground">{item.name}</p>
                        <p className="font-mono text-caption text-foreground-subtle">
                          ${item.price.toFixed(2)}{item.unit ? `/${item.unit}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center rounded-md border border-border-strong">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="flex h-8 w-8 items-center justify-center text-foreground-muted hover:text-foreground"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center font-mono text-label font-medium text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="flex h-8 w-8 items-center justify-center text-foreground-muted hover:text-foreground"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="w-16 shrink-0 text-right font-mono text-body-sm font-medium text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="shrink-0 text-foreground-subtle hover:text-error"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Order summary */}
        <Card className="h-fit p-5 lg:sticky lg:top-24">
          <h2 className="mb-4 font-display text-body font-semibold text-foreground">Order summary</h2>
          <div className="flex flex-col gap-2.5 text-body-sm">
            <div className="flex justify-between text-foreground-muted">
              <span>Subtotal</span>
              <span className="font-mono text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground-muted">
              <span>Delivery</span>
              <span className="font-mono text-foreground">{deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-foreground-muted">
              <span>Estimated tax</span>
              <span className="font-mono text-foreground">${tax.toFixed(2)}</span>
            </div>
            <div className="my-1 h-px bg-border" />
            <div className="flex justify-between text-body font-semibold text-foreground">
              <span>Total</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
          </div>
          <Button variant="primary" size="lg" className="mt-5 w-full" onClick={() => navigate("/checkout")}>
            Proceed to checkout
          </Button>
          {subtotal < FREE_DELIVERY_THRESHOLD && (
            <p className="mt-3 text-center text-caption text-foreground-subtle">
              Add ${(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)} more to a shop's order for free delivery.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
