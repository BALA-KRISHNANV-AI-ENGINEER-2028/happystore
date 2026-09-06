import { useState } from "react";
import { SearchBar } from "@/components/ui/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toaster";
import { adminShops as seedShops, type ShopStatus } from "@/lib/mock-admin";
import { Store } from "lucide-react";

const statusTone: Record<ShopStatus, "success" | "warning" | "error"> = {
  approved: "success", pending: "warning", suspended: "error",
};

export default function AdminShopsPage() {
  const [shops, setShops] = useState(seedShops);
  const [search, setSearch] = useState("");

  function setStatus(id: string, status: ShopStatus) {
    setShops((current) => current.map((s) => (s.id === id ? { ...s, status } : s)));
    toast.success(`${shops.find((s) => s.id === id)?.name} ${status}`);
  }

  const filtered = shops.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="mb-5 font-display text-heading-lg font-semibold text-foreground">Shops</h1>
      <SearchBar placeholder="Search shops" value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} className="mb-5 max-w-xs" />

      {filtered.length === 0 ? (
        <EmptyState icon={<Store size={20} />} title="No matching shops" description="Try a different search term." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shop</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell className="font-medium text-foreground">{shop.name}</TableCell>
                <TableCell className="text-foreground-muted">{shop.owner}</TableCell>
                <TableCell className="text-foreground-muted">{shop.category}</TableCell>
                <TableCell className="font-mono">${shop.revenue.toLocaleString()}</TableCell>
                <TableCell><Badge tone={statusTone[shop.status]}>{shop.status}</Badge></TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    {shop.status === "pending" && (
                      <Button size="sm" variant="secondary" onClick={() => setStatus(shop.id, "approved")}>Approve</Button>
                    )}
                    {shop.status !== "suspended" ? (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(shop.id, "suspended")}>Suspend</Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(shop.id, "approved")}>Reinstate</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
