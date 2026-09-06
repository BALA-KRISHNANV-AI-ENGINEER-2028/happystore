import { Activity, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { systemServices } from "@/lib/mock-admin";

const statusConfig = {
  operational: { icon: CheckCircle2, tone: "success" as const, dot: "bg-success" },
  degraded: { icon: AlertTriangle, tone: "warning" as const, dot: "bg-warning" },
  down: { icon: XCircle, tone: "error" as const, dot: "bg-error" },
};

export default function AdminSystemHealthPage() {
  const allOperational = systemServices.every((s) => s.status === "operational");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 flex items-center gap-2 font-display text-heading-lg font-semibold text-foreground">
        <Activity size={22} /> System health
      </h1>
      <p className="mb-6 text-body-sm text-foreground-muted">Live status of core platform services.</p>

      <Card className={`mb-5 flex items-center gap-3 p-4 ${allOperational ? "border-success/30 bg-success-soft" : "border-warning/30 bg-warning-soft"}`}>
        <span className={`relative flex h-2.5 w-2.5`}>
          <span className={`absolute inline-flex h-full w-full rounded-full ${allOperational ? "bg-success" : "bg-warning"} animate-pulse-ring`} />
          <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${allOperational ? "bg-success" : "bg-warning"}`} />
        </span>
        <p className="text-body-sm font-medium text-foreground">
          {allOperational ? "All systems operational" : "Some systems are experiencing issues"}
        </p>
      </Card>

      <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
        {systemServices.map((service) => {
          const cfg = statusConfig[service.status];
          const Icon = cfg.icon;
          return (
            <div key={service.id} className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <Icon size={16} className={cfg.tone === "success" ? "text-success-600" : cfg.tone === "warning" ? "text-warning-600" : "text-error-600"} />
                <span className="text-body-sm font-medium text-foreground">{service.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-caption text-foreground-subtle">{service.uptime} uptime</span>
                <Badge tone={cfg.tone}>{service.status}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
