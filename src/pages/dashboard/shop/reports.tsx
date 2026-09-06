import { FileText, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

const reports = [
  { id: "r1", title: "Monthly sales summary", period: "June 2026", size: "214 KB" },
  { id: "r2", title: "Inventory snapshot", period: "Jul 1, 2026", size: "88 KB" },
  { id: "r3", title: "Customer activity report", period: "Q2 2026", size: "156 KB" },
  { id: "r4", title: "Tax summary", period: "2025 annual", size: "302 KB" },
];

export default function ShopReportsPage() {
  return (
    <div>
      <h1 className="mb-1 font-display text-heading-lg font-semibold text-foreground">Reports</h1>
      <p className="mb-6 text-body-sm text-foreground-muted">Download reports for accounting, taxes, and operations.</p>

      <div className="flex flex-col gap-3">
        {reports.map((r) => (
          <Card key={r.id} className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
              <FileText size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-sm font-medium text-foreground">{r.title}</p>
              <p className="text-caption text-foreground-subtle">{r.period} · {r.size}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => toast(`Downloading ${r.title}…`)}>
              <Download size={13} /> Download
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
