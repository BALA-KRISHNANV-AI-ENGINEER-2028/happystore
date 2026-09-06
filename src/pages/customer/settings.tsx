import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sun, Moon, Laptop, Download, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { useTheme } from "@/lib/theme";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

const notificationRows = [
  { key: "orderUpdates", label: "Order updates", description: "Status changes for orders you've placed", defaultChecked: true },
  { key: "deliveryAlerts", label: "Delivery alerts", description: "Your order is on the way or has arrived", defaultChecked: true },
  { key: "offers", label: "Special offers", description: "Deals from shops you've ordered from", defaultChecked: true },
  { key: "newShops", label: "New shops nearby", description: "When a new shop joins your neighborhood", defaultChecked: false },
  { key: "newsletter", label: "Weekly newsletter", description: "A weekly roundup of local picks", defaultChecked: false },
];

function ThemeOption({ label, icon: Icon, selected, onClick }: { label: string; icon: typeof Sun; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
        selected ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-border-strong",
      )}
    >
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", selected ? "bg-primary text-foreground-on-primary" : "bg-surface-sunken text-foreground-muted")}>
        <Icon size={18} />
      </div>
      <span className="text-label font-medium text-foreground">{label}</span>
    </button>
  );
}

export default function SettingsPage() {
  const { preference, setPreference } = useTheme();
  const [notifications, setNotifications] = useState(
    Object.fromEntries(notificationRows.map((r) => [r.key, r.defaultChecked])),
  );
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  async function onChangePassword() {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Password updated");
    reset();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-heading-lg font-semibold text-foreground">Settings</h1>

      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="p-5">
            <h2 className="mb-1 font-display text-body font-semibold text-foreground">Change password</h2>
            <p className="mb-4 text-body-sm text-foreground-muted">Use a password you haven't used before.</p>
            <form onSubmit={handleSubmit(onChangePassword)} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="currentPassword">Current password</Label>
                <PasswordInput id="currentPassword" invalid={!!errors.currentPassword} {...register("currentPassword")} />
                {errors.currentPassword && <p className="text-caption text-error">{errors.currentPassword.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newPassword">New password</Label>
                <PasswordInput id="newPassword" invalid={!!errors.newPassword} {...register("newPassword")} />
                {errors.newPassword ? (
                  <p className="text-caption text-error">{errors.newPassword.message}</p>
                ) : (
                  <PasswordStrength password={watch("newPassword") ?? ""} />
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <PasswordInput id="confirmPassword" invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="text-caption text-error">{errors.confirmPassword.message}</p>}
              </div>
              <Button type="submit" variant="primary" loading={isSubmitting} className="self-start">
                Update password
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="divide-y divide-border p-5">
            {notificationRows.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-body-sm font-medium text-foreground">{row.label}</p>
                  <p className="text-caption text-foreground-subtle">{row.description}</p>
                </div>
                <Switch
                  checked={notifications[row.key]}
                  onCheckedChange={(checked) => setNotifications((n) => ({ ...n, [row.key]: checked }))}
                />
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="p-5">
            <h2 className="mb-1 font-display text-body font-semibold text-foreground">Theme</h2>
            <p className="mb-4 text-body-sm text-foreground-muted">Choose how Happy Store looks on this device.</p>
            <div className="flex gap-3">
              <ThemeOption label="Light" icon={Sun} selected={preference === "light"} onClick={() => setPreference("light")} />
              <ThemeOption label="Dark" icon={Moon} selected={preference === "dark"} onClick={() => setPreference("dark")} />
              <ThemeOption label="System" icon={Laptop} selected={preference === "system"} onClick={() => setPreference("system")} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card className="mb-4 flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-body-sm font-medium text-foreground">Download your data</p>
              <p className="text-caption text-foreground-subtle">Get a copy of your orders, addresses, and profile info.</p>
            </div>
            <Button variant="secondary" onClick={() => toast("Preparing your data export…")}>
              <Download size={15} /> Export
            </Button>
          </Card>

          <Card className="flex items-center justify-between gap-4 border-error/25 bg-error-soft p-5">
            <div>
              <p className="text-body-sm font-medium text-foreground">Delete account</p>
              <p className="text-caption text-foreground-subtle">Permanently remove your account and all order history.</p>
            </div>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive"><Trash2 size={15} /> Delete</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete your account?</DialogTitle>
                  <DialogDescription>
                    This permanently removes your profile, saved addresses, and order history. This can't be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Keep account</Button>
                  <Button variant="destructive" onClick={() => { setDeleteOpen(false); toast("Account deletion requested"); }}>
                    Delete account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
