import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { DollarSign, TrendingUp, Percent, Wallet } from "lucide-react";
import { AnalyticsCard } from "@/components/commerce/analytics-card";
import { Card } from "@/components/ui/card";
import { revenueByCategory, platformRevenueSeries } from "@/lib/mock-admin";

export default function AdminRevenuePage() {
  const totalRevenue = revenueByCategory.reduce((s, c) => s + c.revenue, 0);
  const totalOrders = platformRevenueSeries.reduce((s, d) => s + d.orders, 0);
  const commission = totalRevenue * 0.08;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-heading-lg font-semibold text-foreground">Revenue</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard label="Total revenue (30d)" value={`$${totalRevenue.toLocaleString()}`} change={8.1} icon={DollarSign} />
        <AnalyticsCard label="Platform commission" value={`$${commission.toFixed(0)}`} change={8.1} icon={Wallet} />
        <AnalyticsCard label="Avg. order value" value={`$${(totalRevenue / totalOrders).toFixed(2)}`} change={2.4} icon={TrendingUp} />
        <AnalyticsCard label="Take rate" value="8.0%" change={0} icon={Percent} />
      </div>

      <Card className="p-5">
        <h2 className="mb-4 font-display text-body font-semibold text-foreground">Revenue by category</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByCategory} layout="vertical" margin={{ left: 12, right: 24, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--color-foreground-subtle)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12, fill: "var(--color-foreground)" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13 }}
                formatter={(value) => [`$${value}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
