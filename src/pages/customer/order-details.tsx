import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, MessageCircle, PackageX, Store, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { OrderTimeline } from "@/components/commerce/order-timeline";
import { useOrders } from "@/lib/orders-context";
import { toast } from "@/components/ui/toaster";

const statusLabel: Record<string, string> = {
  placed: "Order placed",
  preparing: "Preparing your order",
  on_the_way: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, cancelOrder } = useOrders();
  const order = orderId ? getOrder(orderId) : undefined;
  const [cancelOpen, setCancelOpen] = useState(false);

  if (!order) {
    return (
      <EmptyState
        icon={<PackageX size={20} />}
        title="Order not found"
        description="It may have been removed or the link is incorrect."
        action={<Button variant="secondary" size="sm" onClick={() => navigate("/orders")}>Back to orders</Button>}
      />
    );
  }

  const canCancel = order.status === "placed" || order.status === "preparing";

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate("/orders")}
        className="mb-5 inline-flex items-center gap-1.5 text-body-sm font-medium text-foreground-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to orders
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-heading-lg font-semibold text-foreground">Order #{order.id}</h1>
          <Link to={`/shops/${order.shopId}`} className="mt-1 inline-flex items-center gap-1.5 text-body-sm font-medium text-primary hover:underline">
            <Store size={14} /> {order.shopName}
          </Link>
        </div>
        <Badge tone={order.status === "cancelled" ? "error" : order.status === "delivered" ? "success" : "info"}>
          {statusLabel[order.status]}
        </Badge>
      </div>

      <Card className="mb-6 p-5">
        <OrderTimeline status={order.status} />
        {order.status !== "delivered" && order.status !== "cancelled" && (
          <p className="mt-5 flex items-center gap-1.5 text-body-sm text-foreground-muted">
            <Truck size={14} />
            Estimated {order.method === "delivery" ? "arrival" : "pickup"} in about {order.etaMinutes} minutes
          </p>
        )}
      </Card>

      <Card className="mb-6 p-5">
        <h2 className="mb-3 font-display text-body font-semibold text-foreground">Items</h2>
        <div className="flex flex-col divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between py-2.5 text-body-sm first:pt-0 last:pb-0">
              <span className="text-foreground-muted">{item.quantity} × {item.name}</span>
              <span className="font-mono text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3 text-body-sm">
          <div className="flex justify-between text-foreground-muted">
            <span>Subtotal</span>
            <span className="font-mono text-foreground">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-foreground-muted">
            <span>Delivery</span>
            <span className="font-mono text-foreground">{order.deliveryFee === 0 ? "Free" : `$${order.deliveryFee.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-foreground-muted">
            <span>Tax</span>
            <span className="font-mono text-foreground">${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-foreground">
            <span>Total</span>
            <span className="font-mono">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {order.method === "delivery" && order.address && (
        <Card className="mb-6 flex items-start gap-3 p-5">
          <MapPin size={16} className="mt-0.5 shrink-0 text-foreground-subtle" />
          <div>
            <p className="text-body-sm font-medium text-foreground">Delivery address</p>
            <p className="text-caption text-foreground-subtle">{order.address}</p>
          </div>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => toast("Opening chat…")}>
          <MessageCircle size={15} /> Message {order.shopName}
        </Button>
        {canCancel && (
          <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <X size={15} /> Cancel order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel this order?</DialogTitle>
                <DialogDescription>
                  {order.shopName} may have already started preparing your items. This can't be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setCancelOpen(false)}>Keep order</Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    cancelOrder(order.id);
                    setCancelOpen(false);
                    toast("Order cancelled");
                  }}
                >
                  Cancel order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
