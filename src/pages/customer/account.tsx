import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, MapPin, CreditCard, Package, Heart, Settings, LifeBuoy, Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { defaultProfile, defaultAddresses, defaultPaymentMethods } from "@/lib/mock-user";

const profileSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
});
type ProfileValues = z.infer<typeof profileSchema>;

const quickLinks = [
  { label: "Your orders", to: "/orders", icon: Package },
  { label: "Wishlist", to: "/wishlist", icon: Heart },
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Support", to: "/support", icon: LifeBuoy },
];

export default function AccountPage() {
  const [addresses] = useState(defaultAddresses);
  const [paymentMethods] = useState(defaultPaymentMethods);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: defaultProfile });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Profile updated");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <Avatar fallback={defaultProfile.initials} size="xl" />
        <div>
          <h1 className="font-display text-heading-lg font-semibold text-foreground">{defaultProfile.fullName}</h1>
          <p className="text-body-sm text-foreground-muted">Member since {defaultProfile.memberSince}</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-4 text-center transition-colors hover:border-border-strong hover:bg-surface-sunken"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
              <link.icon size={18} />
            </div>
            <span className="text-label font-medium text-foreground">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Profile form */}
      <Card className="mb-6 p-5">
        <h2 className="mb-4 font-display text-body font-semibold text-foreground">Profile details</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" invalid={!!errors.fullName} {...register("fullName")} />
            {errors.fullName && <p className="text-caption text-error">{errors.fullName.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" invalid={!!errors.email} {...register("email")} />
            {errors.email && <p className="text-caption text-error">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" invalid={!!errors.phone} {...register("phone")} />
            {errors.phone && <p className="text-caption text-error">{errors.phone.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="primary" loading={isSubmitting} disabled={!isDirty}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Addresses */}
      <Card className="mb-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-body font-semibold text-foreground">Saved addresses</h2>
          <Button variant="ghost" size="sm" onClick={() => toast("Add address form coming soon")}>
            <Plus size={14} /> Add new
          </Button>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {addresses.map((a) => (
            <div key={a.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <MapPin size={16} className="shrink-0 text-foreground-subtle" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-body-sm font-medium text-foreground">
                  {a.label}
                  {a.isDefault && <Badge tone="primary">Default</Badge>}
                </p>
                <p className="truncate text-caption text-foreground-subtle">{a.detail}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toast("Edit address form coming soon")}>Edit</Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment methods */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-body font-semibold text-foreground">Payment methods</h2>
          <Button variant="ghost" size="sm" onClick={() => toast("Add payment method form coming soon")}>
            <Plus size={14} /> Add new
          </Button>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {paymentMethods.map((pm) => (
            <div key={pm.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <CreditCard size={16} className="shrink-0 text-foreground-subtle" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-body-sm font-medium text-foreground">
                  {pm.brand} •••• {pm.last4}
                  {pm.isDefault && <Badge tone="primary">Default</Badge>}
                </p>
                <p className="text-caption text-foreground-subtle">Expires {pm.expiry}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toast("Manage payment method coming soon")}>Manage</Button>
            </div>
          ))}
        </div>
      </Card>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-caption text-foreground-subtle">
        <Star size={12} className="fill-accent text-accent" /> You've supported 5 local shops this year.
      </p>
    </div>
  );
}
