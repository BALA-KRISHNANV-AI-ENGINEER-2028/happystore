import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/auth/otp-input";
import { toast } from "@/components/ui/toaster";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? "your email";

  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleVerify() {
    if (code.length < 6) {
      setError(true);
      return;
    }
    setSubmitting(true);
    setError(false);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    toast.success("Email verified");
    navigate("/home");
  }

  function handleResend() {
    setCooldown(30);
    toast("Verification code resent");
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
        <MailCheck size={24} />
      </div>
      <h1 className="font-display text-heading-lg font-semibold text-foreground">Verify your email</h1>
      <p className="mt-2 text-body-sm text-foreground-muted">
        Enter the 6-digit code we sent to <span className="font-medium text-foreground">{email}</span>.
      </p>

      <div className="mt-7 flex justify-center">
        <OtpInput
          value={code}
          onChange={(v) => {
            setCode(v);
            setError(false);
          }}
          invalid={error}
        />
      </div>
      {error && <p className="mt-2 text-caption text-error">Enter all 6 digits to continue.</p>}

      <Button variant="primary" size="lg" className="mt-7 w-full" loading={submitting} onClick={handleVerify}>
        Verify email
      </Button>

      <p className="mt-5 text-body-sm text-foreground-muted">
        Didn't get a code?{" "}
        {cooldown > 0 ? (
          <span className="text-foreground-subtle">Resend in {cooldown}s</span>
        ) : (
          <button onClick={handleResend} className="font-medium text-primary hover:underline">
            Resend code
          </button>
        )}
      </p>
    </div>
  );
}
