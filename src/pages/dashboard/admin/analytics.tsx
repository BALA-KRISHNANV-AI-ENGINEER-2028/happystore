import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Users, Store, Activity, TrendingUp } from "lucide-react";
import { AnalyticsCard } from "@/components/commerce/analytics-card";
import { Card } from "@/components/ui/card";
import { platformRevenueSeries } from "@/lib/mock-admin";

const growthSeries = platformRevenueSeries.map((d, i) => ({
  day: d.day,
  users: 16000 + i * 170 + (i % 3) * 40,
  shops: 255 + Math.floor(i * 2.1),
}));

export default function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-heading-lg font-semibold text-foreground">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard label="Monthly active users" value="18.4k" change={5.6} icon={Users} />
        <AnalyticsCard label="Active shops" value="284" change={3.2} icon={Store} />
        <AnalyticsCard label="Order completion rate" value="96.2%" change={0.8} icon={Activity} />
        <AnalyticsCard label="Platform growth (MoM)" value="12.4%" change={12.4} icon={TrendingUp} />
      </div>

      <Card className="p-5">
        <h2 className="mb-4 font-display text-body font-semibold text-foreground">User &amp; shop growth</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthSeries} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-foreground-subtle)" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="users" tick={{ fontSize: 11, fill: "var(--color-foreground-subtle)" }} axisLine={false} tickLine={false} width={48} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="shops" orientation="right" tick={{ fontSize: 11, fill: "var(--color-foreground-subtle)" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line yAxisId="users" type="monotone" dataKey="users" name="Active users" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
              <Line yAxisId="shops" type="monotone" dataKey="shops" name="Active shops" stroke="var(--color-accent)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
