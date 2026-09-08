import { Link, Outlet } from "react-router-dom";
import { ShieldCheck, Star, Users } from "lucide-react";
import { HappyStoreBag, HappyStoreLogo } from "@/components/brand/happy-store-logo";
import { ThemeSwitcher } from "@/components/auth/theme-switcher";
import marketImage from "@/assets/images/happy_store_market_1788871136406.jpg";

const stats = [
  { icon: Users, label: "12k+ shoppers" },
  { icon: Star, label: "4.8 avg. rating" },
  { icon: ShieldCheck, label: "Verified local shops" },
];

/** Split-screen shell shared by every auth page: brand panel with market imagery + form panel. */
export function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2 transition-colors duration-200">
      {/* Brand panel with neighborhood market image */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex">
        {/* Market background image */}
        <img
          src={marketImage}
          alt="Happy Store local neighborhood market"
          className="absolute inset-0 h-full w-full object-cover object-center select-none"
          referrerPolicy="no-referrer"
          loading="eager"
        />

        {/* Balanced gradient overlay to ensure text readability in both light & dark mode */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/70 dark:from-black/90 dark:via-black/55 dark:to-black/80 pointer-events-none"
        />

        {/* Subtle neighborhood brand tint complementing the Happy Store palette */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-emerald-950/20 mix-blend-multiply pointer-events-none"
        />

        {/* Logo - preserved exactly */}
        <Link to="/" className="relative z-10 flex items-center gap-3 select-none" aria-label="Happy Store Home">
          <HappyStoreBag size={38} />
          <span className="font-display text-heading-sm font-bold tracking-tight text-white">
            <span className="text-[#FF7A00]">Happy</span>
            <span>Store</span>
          </span>
        </Link>

        {/* Brand messaging - preserved */}
        <div className="relative z-10 max-w-sm">
          <p className="font-display text-heading-lg font-semibold leading-tight text-white drop-shadow-sm">
            Discover local.
            <br />
            Shop smarter.
          </p>
          <p className="mt-3 text-body-sm text-white/90 drop-shadow-sm">
            Join thousands of neighbors already ordering from the shops down
            the street.
          </p>
        </div>

        {/* Social proof / statistics - preserved */}
        <div className="relative z-10 flex flex-wrap gap-4">
          {stats.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 text-label text-white/90 drop-shadow-sm">
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
