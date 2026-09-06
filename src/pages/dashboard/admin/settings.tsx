import { useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toaster";

interface PlatformForm {
  platformName: string;
  supportEmail: string;
  commissionRate: number;
}

export default function AdminSettingsPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<PlatformForm>({
    defaultValues: { platformName: "Happy Store", supportEmail: "support@happystore.com", commissionRate: 8 },
  });
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newShopApproval, setNewShopApproval] = useState(true);

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Platform settings updated");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-heading-lg font-semibold text-foreground">Platform settings</h1>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-5">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="platformName">Platform name</Label>
                <Input id="platformName" {...register("platformName")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="supportEmail">Support email</Label>
                <Input id="supportEmail" type="email" {...register("supportEmail")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="commissionRate">Commission rate (%)</Label>
                <Input id="commissionRate" type="number" step="0.1" {...register("commissionRate", { valueAsNumber: true })} />
              </div>
              <Button type="submit" variant="primary" loading={isSubmitting} className="self-start">Save changes</Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card className="divide-y divide-border p-5">
            <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
              <div>
                <p className="text-body-sm font-medium text-foreground">Require approval for new shops</p>
                <p className="text-caption text-foreground-subtle">New shop applications must be manually approved.</p>
              </div>
              <Switch checked={newShopApproval} onCheckedChange={setNewShopApproval} />
            </div>
            <div className="flex items-center justify-between gap-4 py-3.5 last:pb-0">
              <div>
                <p className="text-body-sm font-medium text-foreground">Maintenance mode</p>
                <p className="text-caption text-foreground-subtle">Temporarily take the platform offline for shoppers.</p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
