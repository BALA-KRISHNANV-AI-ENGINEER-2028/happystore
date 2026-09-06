import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toaster";
import { shopOrders as seedOrders, type ShopOrder, type ShopOrderStatus } from "@/lib/mock-shop-owner";
import { PackageSearch } from "lucide-react";

const statusTone: Record<ShopOrderStatus, "neutral" | "warning" | "info" | "success" | "error"> = {
  new: "info",
  preparing: "warning",
  ready: "success",
  completed: "neutral",
  cancelled: "error",
};

const nextStatus: Partial<Record<ShopOrderStatus, { label: string; next: ShopOrderStatus }>> = {
  new: { label: "Accept & prepare", next: "preparing" },
  preparing: { label: "Mark ready", next: "ready" },
  ready: { label: "Mark completed", next: "completed" },
};

export default function ShopOrdersPage() {
  const [orders, setOrders] = useState<ShopOrder[]>(seedOrders);

  function advance(id: string) {
    setOrders((current) =>
      current.map((o) => {
        if (o.id !== id) return o;
        const step = nextStatus[o.status];
        if (!step) return o;
        toast.success(`Order #${o.id} moved to ${step.next.replace("_", " ")}`);
        return { ...o, status: step.next };
      }),
    );
  }

  function cancel(id: string) {
    setOrders((current) => current.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
    toast(`Order #${id} cancelled`);
  }

  function renderTable(list: ShopOrder[]) {
    if (list.length === 0) {
      return <EmptyState icon={<PackageSearch size={20} />} title="No orders here" description="Orders in this state will show up here." />;
    }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((order) => {
            const step = nextStatus[order.status];
            return (
              <TableRow key={order.id}>
                <TableCell className="font-mono">#{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell className="text-foreground-muted">{order.items}</TableCell>
                <TableCell className="capitalize text-foreground-muted">{order.method}</TableCell>
                <TableCell><Badge tone={statusTone[order.status]}>{order.status}</Badge></TableCell>
                <TableCell className="font-mono">${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {step && (
                      <Button size="sm" variant="secondary" onClick={() => advance(order.id)}>{step.label}</Button>
                    )}
                    {(order.status === "new" || order.status === "preparing") && (
                      <Button size="sm" variant="ghost" onClick={() => cancel(order.id)}>Cancel</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  const byStatus = (s: ShopOrderStatus) => orders.filter((o) => o.status === s);

  return (
    <div>
      <h1 className="mb-6 font-display text-heading-lg font-semibold text-foreground">Orders</h1>
      <Tabs defaultValue="new">
        <TabsList className="mb-5">
          <TabsTrigger value="new">New ({byStatus("new").length})</TabsTrigger>
          <TabsTrigger value="preparing">Preparing ({byStatus("preparing").length})</TabsTrigger>
          <TabsTrigger value="ready">Ready ({byStatus("ready").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({byStatus("completed").length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({byStatus("cancelled").length})</TabsTrigger>
        </TabsList>
        <TabsContent value="new">{renderTable(byStatus("new"))}</TabsContent>
        <TabsContent value="preparing">{renderTable(byStatus("preparing"))}</TabsContent>
        <TabsContent value="ready">{renderTable(byStatus("ready"))}</TabsContent>
        <TabsContent value="completed">{renderTable(byStatus("completed"))}</TabsContent>
        <TabsContent value="cancelled">{renderTable(byStatus("cancelled"))}</TabsContent>
      </Tabs>
    </div>
  );
}
