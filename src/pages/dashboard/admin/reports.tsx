import { FileText, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { adminReports } from "@/lib/mock-admin";

export default function AdminReportsPage() {
  return (
    <div>
      <h1 className="mb-1 font-display text-heading-lg font-semibold text-foreground">Reports</h1>
      <p className="mb-6 text-body-sm text-foreground-muted">Platform-wide operational and financial reports.</p>

      <div className="flex flex-col gap-3">
        {adminReports.map((r) => (
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
