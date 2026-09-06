import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Megaphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { promotions as seedPromotions, type Promotion } from "@/lib/mock-shop-owner";
import { toast } from "@/components/ui/toaster";

const statusTone: Record<Promotion["status"], "success" | "info" | "neutral"> = {
  active: "success",
  scheduled: "info",
  ended: "neutral",
};

interface PromoForm {
  title: string;
  discount: string;
  dateRange: string;
}

export default function ShopPromotionsPage() {
  const [promotions, setPromotions] = useState(seedPromotions);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<PromoForm>();

  function onSubmit(values: PromoForm) {
    const promo: Promotion = { id: `promo-${Date.now()}`, status: "scheduled", redemptions: 0, ...values };
    setPromotions((current) => [promo, ...current]);
    toast.success("Promotion created");
    reset();
    setOpen(false);
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-heading-lg font-semibold text-foreground">Promotions</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="primary"><Plus size={15} /> New promotion</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a promotion</DialogTitle>
              <DialogDescription>Set up a new discount or offer for your shop.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Weekend flash sale" required {...register("title")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="discount">Discount</Label>
                <Input id="discount" placeholder="20% off" required {...register("discount")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dateRange">Date range</Label>
                <Input id="dateRange" placeholder="Jul 20 – Jul 21" required {...register("dateRange")} />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {promotions.length === 0 ? (
        <EmptyState icon={<Megaphone size={20} />} title="No promotions yet" description="Create one to attract more customers." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo) => (
            <Card key={promo.id} className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
                  <Megaphone size={16} />
                </div>
                <Badge tone={statusTone[promo.status]}>{promo.status}</Badge>
              </div>
              <p className="font-display text-body font-semibold text-foreground">{promo.title}</p>
              <p className="text-body-sm text-foreground-muted">{promo.discount}</p>
              <p className="mt-3 text-caption text-foreground-subtle">{promo.dateRange}</p>
              <p className="mt-1 text-caption text-foreground-subtle">{promo.redemptions} redemptions</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
