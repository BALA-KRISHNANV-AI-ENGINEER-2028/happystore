import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderCard } from "@/components/commerce/order-card";
import { useOrders, type OrderStatus } from "@/lib/orders-context";

const activeStatuses: OrderStatus[] = ["placed", "preparing", "on_the_way"];

function formatPlacedAt(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

function OrderList({ orders, navigate }: { orders: ReturnType<typeof useOrders>["orders"]; navigate: (path: string) => void }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<Package size={20} />}
        title="No orders here yet"
        description="Orders you place will show up in this list."
        action={<Button variant="secondary" size="sm" asChild><Link to="/shops">Browse shops</Link></Button>}
      />
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          orderId={order.id.replace("ES-", "")}
          shopName={order.shopName}
          itemSummary={order.items.map((i) => i.name).join(", ")}
          total={order.total}
          status={order.status}
          placedAt={formatPlacedAt(order.placedAt)}
          onClick={() => navigate(`/orders/${order.id}`)}
        />
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");

  const active = orders.filter((o) => activeStatuses.includes(o.status));
  const delivered = orders.filter((o) => o.status === "delivered");
  const cancelled = orders.filter((o) => o.status === "cancelled");

  return (
    <div>
      <h1 className="mb-6 font-display text-heading-lg font-semibold text-foreground">Your orders</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-5">
          <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({delivered.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelled.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all"><OrderList orders={orders} navigate={navigate} /></TabsContent>
        <TabsContent value="active"><OrderList orders={active} navigate={navigate} /></TabsContent>
        <TabsContent value="delivered"><OrderList orders={delivered} navigate={navigate} /></TabsContent>
        <TabsContent value="cancelled"><OrderList orders={cancelled} navigate={navigate} /></TabsContent>
      </Tabs>
    </div>
  );
}
