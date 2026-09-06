import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, Store, Users, ArrowRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { AnalyticsCard } from "@/components/commerce/analytics-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { platformRevenueSeries, adminOrders, adminNotifications } from "@/lib/mock-admin";

const statusTone: Record<string, "neutral" | "warning" | "info" | "success" | "error"> = {
  placed: "info", preparing: "warning", on_the_way: "info", delivered: "success", cancelled: "error",
};

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard label="Revenue today" value="$26,200" change={7.8} icon={DollarSign} sparkline={platformRevenueSeries.slice(-8).map((d) => d.revenue)} />
        <AnalyticsCard label="Orders today" value="1,164" change={7.8} icon={ShoppingBag} sparkline={platformRevenueSeries.slice(-8).map((d) => d.orders)} />
        <AnalyticsCard label="Active shops" value="284" change={3.2} icon={Store} sparkline={[260, 265, 268, 270, 274, 278, 281, 284]} />
        <AnalyticsCard label="Active users" value="18.4k" change={5.6} icon={Users} sparkline={[16.1, 16.5, 17, 17.3, 17.8, 18, 18.2, 18.4]} />
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-body font-semibold text-foreground">Platform revenue, last 14 days</h2>
          <Button variant="link" size="sm" asChild>
            <Link to="/dashboard/admin/revenue">Full breakdown <ArrowRight size={13} /></Link>
          </Button>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={platformRevenueSeries} margin={{ left: -8, right: 12, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="adminRevenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-foreground-subtle)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-foreground-subtle)" }} axisLine={false} tickLine={false} width={48} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13 }}
                formatter={(value) => [`$${value}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#adminRevenueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="font-display text-body font-semibold text-foreground">Recent orders</h2>
            <Button variant="link" size="sm" asChild>
              <Link to="/dashboard/admin/orders">View all <ArrowRight size={13} /></Link>
            </Button>
          </div>
          <div className="p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Shop</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminOrders.slice(0, 5).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">#{order.id}</TableCell>
                    <TableCell>{order.shopName}</TableCell>
                    <TableCell><Badge tone={statusTone[order.status]}>{order.status.replace("_", " ")}</Badge></TableCell>
                    <TableCell className="font-mono">${order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-body font-semibold text-foreground">System alerts</h2>
            <Button variant="link" size="sm" asChild>
              <Link to="/dashboard/admin/notifications">All <ArrowRight size={13} /></Link>
            </Button>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {adminNotifications.slice(0, 4).map((n) => (
              <div key={n.id} className="py-2.5 first:pt-0 last:pb-0">
                <p className="text-body-sm font-medium text-foreground">{n.title}</p>
                <p className="text-caption text-foreground-subtle">{n.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
