import { NavLink } from "react-router-dom";
import { Home, Search, Package, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

const tabs = [
  { label: "Home", to: "/home", icon: Home, end: true },
  { label: "Explore", to: "/shops", icon: Search },
  { label: "Orders", to: "/orders", icon: Package },
  { label: "Cart", to: "/cart", icon: ShoppingCart },
  { label: "Account", to: "/account", icon: User },
];

export function MobileTabBar() {
  const { totalItems } = useCart();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {tabs.map(({ label, to, icon: Icon, end }) => {
          const badge = to === "/cart" ? totalItems : undefined;
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-caption font-medium transition-colors",
                  isActive ? "text-primary" : "text-foreground-subtle",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} />
                    {!!badge && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent px-1 font-mono text-[9px] font-semibold leading-none text-foreground-on-accent">
                        {badge}
                      </span>
                    )}
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
