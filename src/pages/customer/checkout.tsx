import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, MapPin, Truck, Store, CreditCard, Banknote, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart, groupCartByShop } from "@/lib/cart-context";
import { useOrders, type Order } from "@/lib/orders-context";
import { cn } from "@/lib/utils";

const DELIVERY_FEE = 3.99;
const FREE_DELIVERY_THRESHOLD = 35;
const TAX_RATE = 0.08;

const addresses = [
  { id: "home", label: "Home", detail: "214 Maple Street, Springfield" },
  { id: "work", label: "Work", detail: "88 Commerce Plaza, Springfield" },
];

function OptionCard({
  selected,
  icon,
  title,
  description,
  value,
}: {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  value: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
        selected ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-border-strong",
      )}
    >
      <RadioGroupItem value={value} className="mt-0.5" />
      <div className="flex items-start gap-3">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", selected ? "bg-primary text-foreground-on-primary" : "bg-surface-sunken text-foreground-muted")}>
          {icon}
        </div>
        <div>
          <p className="text-body-sm font-medium text-foreground">{title}</p>
          <p className="text-caption text-foreground-subtle">{description}</p>
        </div>
      </div>
    </label>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [address, setAddress] = useState("home");
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [payment, setPayment] = useState<"card" | "cash">("card");
  const [placing, setPlacing] = useState(false);
  const [placedOrders, setPlacedOrders] = useState<Order[] | null>(null);

  if (items.length === 0 && !placedOrders) {
    return (
      <EmptyState
        icon={<ShoppingBag size={20} />}
        title="Nothing to check out"
        description="Your cart is empty — add items from a shop first."
        action={<Button variant="secondary" size="sm" asChild><Link to="/shops">Browse shops</Link></Button>}
      />
    );
  }

  const groups = groupCartByShop(items);
  const shopFees = groups.map((g) => {
    const groupSubtotal = g.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const fee = method === "pickup" || groupSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    return { shopId: g.shopId, fee };
  });
  const deliveryFee = shopFees.reduce((s, f) => s + f.fee, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + deliveryFee + tax;
  const addressLabel = addresses.find((a) => a.id === address)?.detail;

  async function handlePlaceOrder() {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1100));

    const created = groups.map((g) => {
      const groupSubtotal = g.items.reduce((s, i) => s + i.price * i.quantity, 0);
      const fee = shopFees.find((f) => f.shopId === g.shopId)!.fee;
      const groupTax = groupSubtotal * TAX_RATE;
      return addOrder({
        shopId: g.shopId,
        shopName: g.shopName,
        items: g.items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, unit: i.unit })),
        subtotal: groupSubtotal,
        deliveryFee: fee,
        tax: groupTax,
        total: groupSubtotal + fee + groupTax,
        method,
        address: method === "delivery" ? addressLabel : undefined,
        etaMinutes: method === "delivery" ? 25 : 12,
      });
    });

    setPlacedOrders(created);
    clearCart();
    setPlacing(false);
  }

  if (placedOrders) {
    const single = placedOrders.length === 1 ? placedOrders[0] : null;
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success-600">
          <CheckCircle2 size={24} />
        </div>
        <h1 className="font-display text-heading-lg font-semibold text-foreground">
          {single ? "Order placed!" : `${placedOrders.length} orders placed!`}
        </h1>
        <p className="mt-2 text-body-sm text-foreground-muted">
          {single ? (
            <>Order <span className="font-mono font-medium text-foreground">#{single.id}</span> is confirmed.</>
          ) : (
            <>Orders {placedOrders.map((o) => `#${o.id}`).join(", ")} are confirmed — one per shop.</>
          )}{" "}
          {method === "delivery" ? "We'll notify you when it's on the way." : "We'll notify you when it's ready for pickup."}
        </p>
        <div className="mt-7 flex flex-col gap-2.5">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(single ? `/orders/${single.id}` : "/orders")}
          >
            Track your order{single ? "" : "s"}
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate("/home")}>Continue shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-heading-lg font-semibold text-foreground">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-8">
          {/* Delivery method */}
          <section>
            <h2 className="mb-3 font-display text-body font-semibold text-foreground">Delivery method</h2>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as "delivery" | "pickup")} className="grid gap-3 sm:grid-cols-2">
              <OptionCard value="delivery" selected={method === "delivery"} icon={<Truck size={16} />} title="Delivery" description="Arrives in 20–30 minutes" />
              <OptionCard value="pickup" selected={method === "pickup"} icon={<Store size={16} />} title="Pickup" description="Ready in 10–15 minutes" />
            </RadioGroup>
          </section>

          {/* Address — only relevant for delivery */}
          {method === "delivery" && (
            <section>
              <h2 className="mb-3 font-display text-body font-semibold text-foreground">Delivery address</h2>
              <RadioGroup value={address} onValueChange={setAddress} className="grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <OptionCard key={a.id} value={a.id} selected={address === a.id} icon={<MapPin size={16} />} title={a.label} description={a.detail} />
                ))}
              </RadioGroup>
            </section>
          )}

          {/* Payment */}
          <section>
            <h2 className="mb-3 font-display text-body font-semibold text-foreground">Payment method</h2>
            <RadioGroup value={payment} onValueChange={(v) => setPayment(v as "card" | "cash")} className="grid gap-3 sm:grid-cols-2">
              <OptionCard value="card" selected={payment === "card"} icon={<CreditCard size={16} />} title="Card" description="Visa ending in 4242" />
              <OptionCard value="cash" selected={payment === "cash"} icon={<Banknote size={16} />} title="Cash on delivery" description="Pay when your order arrives" />
            </RadioGroup>
          </section>
        </div>

        {/* Order summary */}
        <Card className="h-fit p-5 lg:sticky lg:top-24">
          <h2 className="mb-4 font-display text-body font-semibold text-foreground">Order summary</h2>
          <div className="mb-4 flex flex-col gap-2 border-b border-border pb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-body-sm">
                <span className="text-foreground-muted">{item.quantity} × {item.name}</span>
                <span className="font-mono text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2.5 text-body-sm">
            <div className="flex justify-between text-foreground-muted">
              <span>Subtotal</span>
              <span className="font-mono text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground-muted">
              <span>Delivery{groups.length > 1 ? ` (${groups.length} shops)` : ""}</span>
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
          <Button variant="primary" size="lg" className="mt-5 w-full" loading={placing} onClick={handlePlaceOrder}>
            Place order · ${total.toFixed(2)}
          </Button>
        </Card>
      </div>
    </div>
  );
}
