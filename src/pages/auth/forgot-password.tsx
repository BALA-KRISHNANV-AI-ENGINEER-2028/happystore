import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { MailCheck, ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});
type Values = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    await new Promise((r) => setTimeout(r, 900));
    setSentTo(values.email);
  }

  if (sentTo) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success-600">
          <MailCheck size={24} />
        </div>
        <h1 className="font-display text-heading-lg font-semibold text-foreground">Check your email</h1>
        <p className="mt-2 text-body-sm text-foreground-muted">
          We sent a password reset link to <span className="font-medium text-foreground">{sentTo}</span>.
          It expires in 15 minutes.
        </p>
        <Button variant="secondary" className="mt-7 w-full" onClick={() => setSentTo(null)}>
          Use a different email
        </Button>
        <Link to="/login" className="mt-5 inline-flex items-center gap-1.5 text-body-sm font-medium text-primary hover:underline">
          <ArrowLeft size={14} /> Back to log in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-heading-lg font-semibold text-foreground">Forgot your password?</h1>
      <p className="mt-1.5 text-body-sm text-foreground-muted">
        Enter your email and we'll send you a link to reset it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" invalid={!!errors.email} {...register("email")} />
          {errors.email && <p className="text-caption text-error">{errors.email.message}</p>}
        </div>

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
          Send reset link
        </Button>
      </form>

      <Link to="/login" className="mt-7 inline-flex items-center gap-1.5 text-body-sm font-medium text-primary hover:underline">
        <ArrowLeft size={14} /> Back to log in
      </Link>
    </div>
  );
}
