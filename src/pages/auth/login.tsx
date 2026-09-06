import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { toast } from "@/components/ui/toaster";
import { useAppDispatch } from "@/store";
import { loginThunk } from "@/store/slices/authSlice";
import { authService } from "@/services/authService";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Dev accounts — defined at module level so tree-shaking can eliminate them
// in production when import.meta.env.DEV is false.
// ---------------------------------------------------------------------------
const DEV_ACCOUNTS = [
  {
    label: "Admin",
    role: "Admin",
    email: "admin@happystore.local",
    password: "HappyStore_Admin@2026",
    color: "var(--color-error)",
  },
  {
    label: "Shop Owner",
    role: "Shop Owner — Happy Fresh Market",
    email: "owner@happystore.local",
    password: "HappyStore_Owner@2026",
    color: "var(--color-primary)",
  },
  {
    label: "Customer",
    role: "Customer",
    email: "customer@happystore.local",
    password: "HappyStore_Customer@2026",
    color: "var(--color-success)",
  },
] as const;

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { remember: true } });

  // Surface an error redirected back from the Google OAuth flow (cancelled
  // consent, invalid/expired state, Google API failure, etc.).
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error("Google sign-in failed", { description: error });
      const next = new URLSearchParams(searchParams);
      next.delete("error");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function handleGoogleLogin() {
    authService.loginWithGoogle();
  }

  async function onSubmit(values: LoginValues) {
    const result = await dispatch(loginThunk({ email: values.email, password: values.password, remember: values.remember }));
    if (loginThunk.fulfilled.match(result)) {
      const role = result.payload?.user?.role;
      toast.success("Welcome back", { description: `Signed in as ${values.email}` });
      if (role === "admin") {
        navigate("/dashboard/admin");
      } else if (role === "shop_owner") {
        navigate("/dashboard/shop");
      } else {
        navigate("/home");
      }
    } else {
      toast.error("Login failed", { description: "Invalid email or password." });
    }
  }

  // Quick-login: prefill fields and submit the form immediately
  async function devLogin(email: string, password: string) {
    setValue("email", email);
    setValue("password", password);
    // Slight delay so React batches the state update before submit
    await new Promise((r) => setTimeout(r, 50));
    await handleSubmit(onSubmit)();
  }

  return (
    <div>
      <h1 className="font-display text-heading-lg font-semibold text-foreground">Welcome back</h1>
      <p className="mt-1.5 text-body-sm text-foreground-muted">Log in to continue shopping local.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" invalid={!!errors.email} {...register("email")} />
          {errors.email && <p className="text-caption text-error">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-caption font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput id="password" placeholder="••••••••" invalid={!!errors.password} {...register("password")} />
          {errors.password && <p className="text-caption text-error">{errors.password.message}</p>}
        </div>

        <label className="flex items-center gap-2.5">
          <Controller
            control={control}
            name="remember"
            render={({ field }) => (
              <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
            )}
          />
          <span className="text-body-sm text-foreground">Remember me for 30 days</span>
        </label>

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="mt-1">
          Log in
        </Button>

        <div className="my-1 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-caption text-foreground-subtle">or continue with</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <SocialButtons onGoogleClick={handleGoogleLogin} />
      </form>

      <p className="mt-7 text-center text-body-sm text-foreground-muted">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>

      {/* ── Dev Login Panel ─────────────────────────────────────────────────── */}
      {/* This section is compiled away entirely in production builds.          */}
      {/* Vite replaces import.meta.env.DEV with `false` and dead-code         */}
      {/* elimination removes everything inside the block.                     */}
      {import.meta.env.DEV && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            borderRadius: "0.75rem",
            border: "1px dashed rgba(255,180,0,0.4)",
            background: "rgba(255,160,0,0.04)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(200,140,0,0.9)",
              }}
            >
              Dev Test Accounts
            </p>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                padding: "1px 6px",
                borderRadius: "99px",
                background: "rgba(255,60,0,0.12)",
                color: "rgba(220,60,0,0.9)",
                letterSpacing: "0.04em",
              }}
            >
              DEV ONLY
            </span>
          </div>

          {/* Account buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {DEV_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                disabled={isSubmitting}
                onClick={() => devLogin(account.email, account.password)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(128,128,128,0.18)",
                  background: "rgba(128,128,128,0.06)",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                  opacity: isSubmitting ? 0.5 : 1,
                  textAlign: "left",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(128,128,128,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(128,128,128,0.06)"; }}
              >
                <span style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-foreground)" }}>
                    {account.label}
                  </span>
                  <span style={{ fontSize: "0.69rem", color: "var(--color-foreground-muted)" }}>
                    {account.email}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "99px",
                    background: `color-mix(in srgb, ${account.color} 14%, transparent)`,
                    color: account.color,
                    letterSpacing: "0.03em",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {account.role}
                </span>
              </button>
            ))}
          </div>

          <p
            style={{
              marginTop: "0.6rem",
              fontSize: "0.67rem",
              color: "rgba(128,128,128,0.6)",
              textAlign: "center",
            }}
          >
            Never exposed in production builds
          </p>
        </div>
      )}
    </div>
  );
}

