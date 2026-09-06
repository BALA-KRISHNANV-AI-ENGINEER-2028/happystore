import { useState } from "react";
import { SearchBar } from "@/components/ui/search-bar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { adminOrders, type AdminOrder } from "@/lib/mock-admin";
import { ShoppingBag } from "lucide-react";

const statusTone: Record<AdminOrder["status"], "neutral" | "warning" | "info" | "success" | "error"> = {
  placed: "info", preparing: "warning", on_the_way: "info", delivered: "success", cancelled: "error",
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const filtered = adminOrders.filter(
    (o) => o.shopName.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1 className="mb-5 font-display text-heading-lg font-semibold text-foreground">Orders</h1>
      <SearchBar placeholder="Search by shop or customer" value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} className="mb-5 max-w-xs" />

      {filtered.length === 0 ? (
        <EmptyState icon={<ShoppingBag size={20} />} title="No matching orders" description="Try a different search term." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Placed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono">#{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell className="text-foreground-muted">{order.shopName}</TableCell>
                <TableCell><Badge tone={statusTone[order.status]}>{order.status.replace("_", " ")}</Badge></TableCell>
                <TableCell className="font-mono">${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-foreground-muted">{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
