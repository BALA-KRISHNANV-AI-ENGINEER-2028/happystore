import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { SocialButtons } from "@/components/auth/social-buttons";
import { toast } from "@/components/ui/toaster";
import { useAppDispatch } from "@/store";
import { registerThunk } from "@/store/slices/authSlice";
import { authService } from "@/services/authService";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((v) => v === true, { message: "You must accept the terms to continue" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema), defaultValues: { terms: false } });

  const password = watch("password") ?? "";

  async function onSubmit(values: RegisterValues) {
    const result = await dispatch(
      registerThunk({ fullName: values.fullName, email: values.email, password: values.password }),
    );
    if (registerThunk.fulfilled.match(result)) {
      navigate("/verify-email", { state: { email: values.email } });
    } else {
      const message = result.error?.message ?? "Something went wrong. Please try again.";
      toast.error("Registration failed", { description: message });
    }
  }

  function handleGoogleSignup() {
    authService.loginWithGoogle();
  }

  return (
    <div>
      <h1 className="font-display text-heading-lg font-semibold text-foreground">Create your account</h1>
      <p className="mt-1.5 text-body-sm text-foreground-muted">Join your neighborhood marketplace in under a minute.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" placeholder="Jordan Rivera" invalid={!!errors.fullName} {...register("fullName")} />
          {errors.fullName && <p className="text-caption text-error">{errors.fullName.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" invalid={!!errors.email} {...register("email")} />
          {errors.email && <p className="text-caption text-error">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordInput id="password" placeholder="••••••••" invalid={!!errors.password} {...register("password")} />
          {errors.password ? (
            <p className="text-caption text-error">{errors.password.message}</p>
          ) : (
            <PasswordStrength password={password} />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="••••••••"
            invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p className="text-caption text-error">{errors.confirmPassword.message}</p>}
        </div>

        <div>
          <label className="flex items-start gap-2.5">
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <Checkbox
                  className="mt-0.5"
                  checked={field.value === true}
                  onCheckedChange={(v) => field.onChange(v === true)}
                />
              )}
            />
            <span className="text-body-sm text-foreground">
              I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </span>
          </label>
          {errors.terms && <p className="mt-1 text-caption text-error">{errors.terms.message}</p>}
        </div>

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="mt-1">
          Create account
        </Button>

        <div className="my-1 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-caption text-foreground-subtle">or continue with</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <SocialButtons onGoogleClick={handleGoogleSignup} />
      </form>

      <p className="mt-7 text-center text-body-sm text-foreground-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
