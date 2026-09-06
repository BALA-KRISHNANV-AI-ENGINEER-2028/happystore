import { Link, Outlet } from "react-router-dom";
import { Store, ShieldCheck, Star, Users } from "lucide-react";

const stats = [
  { icon: Users, label: "12k+ shoppers" },
  { icon: Star, label: "4.8 avg. rating" },
  { icon: ShieldCheck, label: "Verified local shops" },
];

/** Split-screen shell shared by every auth page: brand panel + form panel. */
export function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-foreground-on-primary lg:flex">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 15%, rgba(255,255,255,0.10) 0%, transparent 70%), radial-gradient(50% 50% at 85% 85%, rgba(232,163,61,0.18) 0%, transparent 70%)",
          }}
        />
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/15">
            <Store size={16} strokeWidth={2.5} />
          </div>
          <span className="font-display text-body-lg font-semibold">Happy Store</span>
        </Link>

        <div className="relative z-10 max-w-sm">
          <p className="font-display text-heading-lg font-semibold leading-tight">
            Discover local.
            <br />
            Shop smarter.
          </p>
          <p className="mt-3 text-body-sm text-white/75">
            Join thousands of neighbors already ordering from the shops down
            the street.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-4">
          {stats.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 text-label text-white/80">
              <Icon size={14} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-foreground-on-primary">
            <Store size={16} strokeWidth={2.5} />
          </div>
          <span className="font-display text-body-lg font-semibold text-foreground">Happy Store</span>
        </Link>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
