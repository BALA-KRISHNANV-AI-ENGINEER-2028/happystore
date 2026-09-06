import { useState } from "react";
import { SearchBar } from "@/components/ui/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toaster";
import { adminProducts as seedProducts } from "@/lib/mock-admin";
import { Package } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(seedProducts);
  const [search, setSearch] = useState("");

  function unflag(id: string) {
    setProducts((current) => current.map((p) => (p.id === id ? { ...p, flagged: false } : p)));
    toast.success("Product cleared");
  }

  function remove(id: string) {
    setProducts((current) => current.filter((p) => p.id !== id));
    toast("Product removed from platform");
  }

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="mb-5 font-display text-heading-lg font-semibold text-foreground">Products</h1>
      <SearchBar placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} className="mb-5 max-w-xs" />

      {filtered.length === 0 ? (
        <EmptyState icon={<Package size={20} />} title="No matching products" description="Try a different search term." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                <TableCell className="text-foreground-muted">{p.shopName}</TableCell>
                <TableCell className="text-foreground-muted">{p.category}</TableCell>
                <TableCell className="font-mono">${p.price.toFixed(2)}</TableCell>
                <TableCell>{p.flagged ? <Badge tone="error">Flagged</Badge> : <Badge tone="success">Active</Badge>}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    {p.flagged && <Button size="sm" variant="secondary" onClick={() => unflag(p.id)}>Clear flag</Button>}
                    <Button size="sm" variant="ghost" onClick={() => remove(p.id)}>Remove</Button>
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
