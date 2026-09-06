import { useState } from "react";
import { SearchBar } from "@/components/ui/search-bar";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toaster";
import { adminUsers as seedUsers, type UserRole } from "@/lib/mock-admin";
import { Users as UsersIcon } from "lucide-react";

const roleLabel: Record<UserRole, string> = { customer: "Customer", shop_owner: "Shop owner", admin: "Admin" };
const roleFilters: (UserRole | "all")[] = ["all", "customer", "shop_owner", "admin"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(seedUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");

  function toggleStatus(id: string) {
    setUsers((current) =>
      current.map((u) => {
        if (u.id !== id) return u;
        const status = u.status === "active" ? "suspended" : "active";
        toast(status === "suspended" ? `${u.name} suspended` : `${u.name} reactivated`);
        return { ...u, status };
      }),
    );
  }

  const filtered = users.filter(
    (u) => (roleFilter === "all" || u.role === roleFilter) && u.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1 className="mb-5 font-display text-heading-lg font-semibold text-foreground">Users</h1>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar placeholder="Search users" value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} className="sm:max-w-xs" />
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {roleFilters.map((r) => (
          <Chip key={r} selected={roleFilter === r} onClick={() => setRoleFilter(r)}>
            {r === "all" ? "All roles" : roleLabel[r]}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<UsersIcon size={20} />} title="No matching users" description="Try a different search or filter." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar fallback={u.initials} size="sm" />
                    <div>
                      <p className="font-medium text-foreground">{u.name}</p>
                      <p className="text-caption text-foreground-subtle">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge tone={u.role === "admin" ? "accent" : u.role === "shop_owner" ? "primary" : "neutral"}>{roleLabel[u.role]}</Badge></TableCell>
                <TableCell>{u.orders}</TableCell>
                <TableCell className="text-foreground-muted">{u.joined}</TableCell>
                <TableCell><Badge tone={u.status === "active" ? "success" : "error"}>{u.status}</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => toggleStatus(u.id)}>
                    {u.status === "active" ? "Suspend" : "Reactivate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
