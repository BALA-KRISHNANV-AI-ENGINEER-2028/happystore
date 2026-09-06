import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, Star, Users, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { AnalyticsCard } from "@/components/commerce/analytics-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { shopOrders, revenueSeries } from "@/lib/mock-shop-owner";

const statusTone: Record<string, "neutral" | "warning" | "info" | "success" | "error"> = {
  new: "info",
  preparing: "warning",
  ready: "success",
  completed: "neutral",
  cancelled: "error",
};

export default function ShopOverviewPage() {
  const recentOrders = shopOrders.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard label="Revenue today" value="$645" change={7.9} icon={DollarSign} sparkline={revenueSeries.slice(-8).map((d) => d.revenue)} />
        <AnalyticsCard label="Orders today" value="29" change={11.5} icon={ShoppingBag} sparkline={revenueSeries.slice(-8).map((d) => d.orders)} />
        <AnalyticsCard label="Avg. rating" value="4.8" change={1.2} icon={Star} sparkline={[4.6, 4.7, 4.6, 4.7, 4.8, 4.7, 4.8, 4.8]} />
        <AnalyticsCard label="New customers" value="12" change={-4.3} icon={Users} sparkline={[3, 4, 2, 5, 3, 4, 3, 2]} />
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-body font-semibold text-foreground">Revenue, last 14 days</h2>
          <Button variant="link" size="sm" asChild>
            <Link to="/dashboard/shop/analytics">Full analytics <ArrowRight size={13} /></Link>
          </Button>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueSeries} margin={{ left: -12, right: 12, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-foreground-subtle)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-foreground-subtle)" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 13,
                }}
                formatter={(value) => [`$${value}`, "Revenue"]}
              />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 className="font-display text-body font-semibold text-foreground">Recent orders</h2>
          <Button variant="link" size="sm" asChild>
            <Link to="/dashboard/shop/orders">View all <ArrowRight size={13} /></Link>
          </Button>
        </div>
        <div className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">#{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell className="text-foreground-muted">{order.items}</TableCell>
                  <TableCell><Badge tone={statusTone[order.status]}>{order.status}</Badge></TableCell>
                  <TableCell className="font-mono">${order.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
