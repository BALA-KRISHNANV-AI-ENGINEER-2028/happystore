import { Link, Outlet } from "react-router-dom";
import { ShieldCheck, Star, Users } from "lucide-react";
import { HappyStoreBag, HappyStoreLogo } from "@/components/brand/happy-store-logo";
import { ThemeSwitcher } from "@/components/auth/theme-switcher";

const stats = [
  { icon: Users, label: "12k+ shoppers" },
  { icon: Star, label: "4.8 avg. rating" },
  { icon: ShieldCheck, label: "Verified local shops" },
];

/** Split-screen shell shared by every auth page: brand panel + form panel. */
export function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2 transition-colors duration-200">
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
        <Link to="/" className="relative z-10 flex items-center gap-3 select-none" aria-label="Happy Store Home">
          <HappyStoreBag size={38} />
          <span className="font-display text-heading-sm font-bold tracking-tight text-white">
            <span className="text-[#FF7A00]">Happy</span>
            <span>Store</span>
          </span>
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
      <div className="relative flex flex-col justify-between px-6 py-8 sm:px-10 transition-colors duration-200">
        {/* Top header: mobile brand on left, theme switcher pinned to top right */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center lg:hidden" aria-label="Happy Store Home">
            <HappyStoreLogo size={32} />
          </Link>

          {/* Top-right theme switcher (accessible and responsive on desktop and mobile) */}
          <div className="ml-auto lg:absolute lg:top-8 lg:right-10 z-20">
            <ThemeSwitcher />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>

        {/* Subtle spacing for vertical balance */}
        <div className="hidden lg:block h-6" aria-hidden="true" />
      </div>
    </div>
  );
}
