// =============================================================================
// Happy Store — Google OAuth Callback
// Landing point for the redirect from backend GET /auth/google/callback.
// The backend never puts tokens in this URL — only a one-time `code`, which
// this page immediately exchanges for real session tokens.
// =============================================================================

import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { exchangeGoogleCodeThunk } from "@/store/slices/authSlice";
import { toast } from "@/components/ui/toaster";
import { ROUTES } from "@/constants";

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    // Guards against React StrictMode's double-invoke in dev, which would
    // otherwise burn the one-time exchange code on the first (discarded) run.
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get("code");
    if (!code) {
      navigate(`${ROUTES.LOGIN}?error=${encodeURIComponent("Missing sign-in code. Please try again.")}`, {
        replace: true,
      });
      return;
    }

    dispatch(exchangeGoogleCodeThunk(code)).then((result) => {
      if (exchangeGoogleCodeThunk.fulfilled.match(result)) {
        const role = result.payload.user?.role;
        toast.success("Welcome", { description: "Signed in with Google." });
        if (role === "admin") navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        else if (role === "shop_owner") navigate(ROUTES.SHOP_DASHBOARD, { replace: true });
        else navigate(ROUTES.HOME, { replace: true });
      } else {
        const message = result.error?.message ?? "Google sign-in failed. Please try again.";
        navigate(`${ROUTES.LOGIN}?error=${encodeURIComponent(message)}`, { replace: true });
      }
    });
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-body-sm text-foreground-muted">Finishing sign-in with Google…</p>
    </div>
  );
}
