import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";

const schema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type Values = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const password = watch("password") ?? "";

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 900));
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success-600">
          <CheckCircle2 size={24} />
        </div>
        <h1 className="font-display text-heading-lg font-semibold text-foreground">Password updated</h1>
        <p className="mt-2 text-body-sm text-foreground-muted">
          Your password has been changed. You can now log in with your new password.
        </p>
        <Button variant="primary" size="lg" className="mt-7 w-full" onClick={() => navigate("/login")}>
          Back to log in
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-heading-lg font-semibold text-foreground">Set a new password</h1>
      <p className="mt-1.5 text-body-sm text-foreground-muted">
        Choose a strong password you haven't used before.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">New password</Label>
          <PasswordInput id="password" placeholder="••••••••" invalid={!!errors.password} {...register("password")} />
          {errors.password ? (
            <p className="text-caption text-error">{errors.password.message}</p>
          ) : (
            <PasswordStrength password={password} />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="••••••••"
            invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p className="text-caption text-error">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
          Update password
        </Button>
      </form>

      <p className="mt-7 text-center text-body-sm text-foreground-muted">
        Remembered it after all?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
