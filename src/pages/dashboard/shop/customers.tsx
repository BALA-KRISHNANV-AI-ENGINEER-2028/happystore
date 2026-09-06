import { useState } from "react";
import { SearchBar } from "@/components/ui/search-bar";
import { Avatar } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { customers as seedCustomers } from "@/lib/mock-shop-owner";
import { Users } from "lucide-react";

export default function ShopCustomersPage() {
  const [search, setSearch] = useState("");
  const filtered = seedCustomers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="mb-5 font-display text-heading-lg font-semibold text-foreground">Customers</h1>
      <SearchBar
        placeholder="Search customers"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
        className="mb-5 max-w-xs"
      />

      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={20} />} title="No matching customers" description="Try a different search term." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total spent</TableHead>
              <TableHead>Last order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar fallback={c.initials} size="sm" />
                    <div>
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-caption text-foreground-subtle">{c.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{c.ordersCount}</TableCell>
                <TableCell className="font-mono">${c.totalSpent.toFixed(2)}</TableCell>
                <TableCell className="text-foreground-muted">{c.lastOrder}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
