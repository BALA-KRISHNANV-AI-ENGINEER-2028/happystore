import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { DollarSign, ShoppingBag, TrendingUp, Percent } from "lucide-react";
import { AnalyticsCard } from "@/components/commerce/analytics-card";
import { Card } from "@/components/ui/card";
import { revenueSeries, topProducts } from "@/lib/mock-shop-owner";

export default function ShopAnalyticsPage() {
  const totalRevenue = revenueSeries.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = revenueSeries.reduce((s, d) => s + d.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const maxUnits = Math.max(...topProducts.map((p) => p.unitsSold));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard label="Revenue (14d)" value={`$${totalRevenue.toLocaleString()}`} change={9.2} icon={DollarSign} />
        <AnalyticsCard label="Orders (14d)" value={totalOrders.toString()} change={6.4} icon={ShoppingBag} />
        <AnalyticsCard label="Avg. order value" value={`$${avgOrderValue.toFixed(2)}`} change={2.1} icon={TrendingUp} />
        <AnalyticsCard label="Repeat customer rate" value="61%" change={3.8} icon={Percent} />
      </div>

      <Card className="p-5">
        <h2 className="mb-4 font-display text-body font-semibold text-foreground">Revenue trend</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueSeries} margin={{ left: -12, right: 12, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-foreground-subtle)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-foreground-subtle)" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13 }}
                formatter={(value) => [`$${value}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#revenueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 font-display text-body font-semibold text-foreground">Orders per day</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries} margin={{ left: -12, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--color-foreground-subtle)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-foreground-subtle)" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13 }} />
                <Bar dataKey="orders" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-display text-body font-semibold text-foreground">Top products</h2>
          <div className="flex flex-col gap-3">
            {topProducts.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-body-sm text-foreground">{p.name}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-sunken">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(p.unitsSold / maxUnits) * 100}%` }} />
                </div>
                <span className="w-10 shrink-0 text-right font-mono text-caption text-foreground-subtle">{p.unitsSold}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
