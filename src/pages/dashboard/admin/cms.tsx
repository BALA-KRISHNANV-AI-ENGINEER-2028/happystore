import { useState } from "react";
import { FileEdit, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { cmsBanners as seedBanners } from "@/lib/mock-admin";

export default function AdminCmsPage() {
  const [banners, setBanners] = useState(seedBanners);

  function toggleStatus(id: string) {
    setBanners((current) =>
      current.map((b) => (b.id === id ? { ...b, status: b.status === "published" ? "draft" : "published" } : b)),
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-heading-lg font-semibold text-foreground">CMS</h1>
        <Button variant="primary" onClick={() => toast("New banner editor coming soon")}>
          <Plus size={15} /> New banner
        </Button>
      </div>
      <p className="mb-6 text-body-sm text-foreground-muted">Manage landing page banners and site-wide content.</p>

      <div className="flex flex-col gap-3">
        {banners.map((b) => (
          <Card key={b.id} className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
              <FileEdit size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-sm font-medium text-foreground">{b.title}</p>
              <p className="text-caption text-foreground-subtle">{b.placement}</p>
            </div>
            <Badge tone={b.status === "published" ? "success" : "neutral"}>{b.status}</Badge>
            <Button variant="ghost" size="sm" onClick={() => toggleStatus(b.id)}>
              {b.status === "published" ? "Unpublish" : "Publish"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
