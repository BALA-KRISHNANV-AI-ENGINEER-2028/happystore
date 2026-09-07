import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Bell, ShoppingCart, Menu, X, LogOut, Package, Heart, Settings, LifeBuoy } from "lucide-react";
import { HappyStoreLogo } from "@/components/brand/happy-store-logo";
import { SearchBar } from "@/components/ui/search-bar";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

const primaryLinks = [
  { label: "Home", to: "/home" },
  { label: "Nearby shops", to: "/shops" },
  { label: "Categories", to: "/categories" },
  { label: "Offers", to: "/offers" },
];

function IconLinkBadge({ to, icon, badge, label }: { to: string; icon: React.ReactNode; badge?: number; label: string }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-surface-sunken hover:text-foreground"
    >
      {icon}
      {!!badge && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-semibold leading-none text-foreground-on-accent">
          {badge}
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { totalItems } = useCart();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    setMobileOpen(false);
    navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/home" className="flex shrink-0 items-center focus:outline-none" aria-label="Happy Store Home">
          <HappyStoreLogo size={32} textClassName="hidden sm:inline" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/home"}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-body-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-foreground-muted hover:text-foreground",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="hidden flex-1 justify-center lg:flex">
          <SearchBar
            placeholder="Search shops or products"
            className="max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </form>

        <div className="ml-auto flex items-center gap-1">
          <IconLinkBadge to="/notifications" icon={<Bell size={18} />} badge={3} label="Notifications" />
          <IconLinkBadge to="/cart" icon={<ShoppingCart size={18} />} badge={totalItems || undefined} label="Cart" />

          <DropdownMenu>
            <DropdownMenuTrigger className="ml-1 rounded-full focus-visible:outline-none">
              <Avatar fallback="JR" size="sm" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Jordan Rivera</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/orders"><Package size={15} className="mr-2" /> My orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/wishlist"><Heart size={15} className="mr-2" /> Wishlist</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings"><Settings size={15} className="mr-2" /> Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/support"><LifeBuoy size={15} className="mr-2" /> Support</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-error">
                <LogOut size={15} className="mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-sunken md:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-background px-4 py-3 md:hidden">
          <form onSubmit={submitSearch}>
            <SearchBar
              placeholder="Search shops or products"
              className="mb-3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </form>
          <div className="flex flex-col">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/home"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2.5 text-body-sm font-medium",
                    isActive ? "bg-primary-soft text-primary-strong" : "text-foreground-muted",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
