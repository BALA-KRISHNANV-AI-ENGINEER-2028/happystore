import { useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toaster";

interface ShopProfileForm {
  name: string;
  category: string;
  description: string;
  address: string;
}

const defaultHours = [
  { day: "Monday – Friday", open: "07:00", close: "22:00" },
  { day: "Saturday", open: "08:00", close: "22:00" },
  { day: "Sunday", open: "08:00", close: "20:00" },
];

export default function ShopSettingsPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ShopProfileForm>({
    defaultValues: {
      name: "Corner Market",
      category: "Grocery · Convenience",
      description: "Your neighborhood grocery stop for fresh produce, dairy, and pantry staples.",
      address: "214 Maple Street, Springfield",
    },
  });
  const [hours, setHours] = useState(defaultHours);
  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Shop profile updated");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-heading-lg font-semibold text-foreground">Shop settings</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-5">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Shop name</Label>
                <Input id="name" {...register("name")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category">Category</Label>
                <Input id="category" {...register("category")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address")} />
              </div>
              <Button type="submit" variant="primary" loading={isSubmitting} className="self-start">Save changes</Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card className="p-5">
            <div className="flex flex-col divide-y divide-border">
              {hours.map((h, i) => (
                <div key={h.day} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="text-body-sm font-medium text-foreground">{h.day}</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={h.open}
                      onChange={(e) => setHours((current) => current.map((row, idx) => (idx === i ? { ...row, open: e.target.value } : row)))}
                      className="w-32"
                    />
                    <span className="text-foreground-subtle">–</span>
                    <Input
                      type="time"
                      value={h.close}
                      onChange={(e) => setHours((current) => current.map((row, idx) => (idx === i ? { ...row, close: e.target.value } : row)))}
                      className="w-32"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="primary" className="mt-4" onClick={() => toast.success("Hours updated")}>Save hours</Button>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="divide-y divide-border p-5">
            <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
              <div>
                <p className="text-body-sm font-medium text-foreground">Accepting orders</p>
                <p className="text-caption text-foreground-subtle">Turn off to pause new orders temporarily.</p>
              </div>
              <Switch checked={acceptingOrders} onCheckedChange={setAcceptingOrders} />
            </div>
            <div className="flex items-center justify-between gap-4 py-3.5 last:pb-0">
              <div>
                <p className="text-body-sm font-medium text-foreground">Auto-accept orders</p>
                <p className="text-caption text-foreground-subtle">Skip manual review and start preparing immediately.</p>
              </div>
              <Switch checked={autoAccept} onCheckedChange={setAutoAccept} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
