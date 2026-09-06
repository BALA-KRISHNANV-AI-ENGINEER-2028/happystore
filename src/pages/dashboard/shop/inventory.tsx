import { useState } from "react";
import { Minus, Plus, Search } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { inventory as seedInventory } from "@/lib/mock-shop-owner";
import { toast } from "@/components/ui/toaster";

export default function ShopInventoryPage() {
  const [items, setItems] = useState(seedInventory);
  const [search, setSearch] = useState("");

  function adjustStock(id: string, delta: number) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item)),
    );
  }

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  const lowStockCount = items.filter((i) => i.stock > 0 && i.stock <= i.lowStockThreshold).length;
  const outOfStockCount = items.filter((i) => i.stock === 0).length;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-heading-lg font-semibold text-foreground">Inventory</h1>
        <div className="flex gap-2">
          {outOfStockCount > 0 && <Badge tone="error">{outOfStockCount} out of stock</Badge>}
          {lowStockCount > 0 && <Badge tone="warning">{lowStockCount} low stock</Badge>}
        </div>
      </div>

      <SearchBar
        placeholder="Search inventory"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
        className="mb-5 max-w-xs"
      />

      {filtered.length === 0 ? (
        <EmptyState icon={<Search size={20} />} title="No matching products" description="Try a different search term." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => {
              const low = item.stock > 0 && item.stock <= item.lowStockThreshold;
              const out = item.stock === 0;
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                  <TableCell className="text-foreground-muted">{item.category}</TableCell>
                  <TableCell className="font-mono">${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjustStock(item.id, -1)}
                        aria-label={`Decrease stock for ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border-strong text-foreground-muted hover:text-foreground"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-mono text-body-sm font-medium text-foreground">{item.stock}</span>
                      <button
                        onClick={() => { adjustStock(item.id, 1); toast(`${item.name} stock updated`); }}
                        aria-label={`Increase stock for ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border-strong text-foreground-muted hover:text-foreground"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {out ? (
                      <Badge tone="error">Out of stock</Badge>
                    ) : low ? (
                      <Badge tone="warning">Low stock</Badge>
                    ) : (
                      <Badge tone="success">In stock</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
