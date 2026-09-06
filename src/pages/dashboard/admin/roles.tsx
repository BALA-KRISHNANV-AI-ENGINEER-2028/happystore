import { Shield, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { adminRoles } from "@/lib/mock-admin";

export default function AdminRolesPage() {
  return (
    <div>
      <h1 className="mb-1 flex items-center gap-2 font-display text-heading-lg font-semibold text-foreground">
        <Shield size={22} /> Role management
      </h1>
      <p className="mb-6 text-body-sm text-foreground-muted">Control what each team role can see and do.</p>

      <div className="grid gap-4 lg:grid-cols-2">
        {adminRoles.map((role) => (
          <Card key={role.id} className="p-5">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="font-display text-body font-semibold text-foreground">{role.name}</p>
                <p className="text-caption text-foreground-subtle">{role.description}</p>
              </div>
              <Badge tone="neutral" className="inline-flex items-center gap-1">
                <Users size={11} /> {role.userCount}
              </Badge>
            </div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {role.permissions.map((perm) => (
                <Badge key={perm} tone="primary">{perm}</Badge>
              ))}
            </div>
            <Button variant="secondary" size="sm" onClick={() => toast(`Editing ${role.name} permissions…`)}>
              Edit permissions
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
