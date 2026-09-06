import { useState } from "react";
import { Link } from "react-router-dom";
import { Store, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Explore shops", href: "#featured-shops" },
  { label: "Categories", href: "#categories" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For business", href: "#for-business" },
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-foreground-on-primary">
            <Store size={16} strokeWidth={2.5} />
          </div>
          <span className="font-display text-body-lg font-semibold text-foreground">Happy Store</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-body-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link to="/register">Get started</Link>
          </Button>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-sunken sm:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-body-sm font-medium text-foreground-muted"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-2 flex gap-2 border-t border-border pt-3">
            <Button variant="ghost" size="sm" className="flex-1" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button variant="primary" size="sm" className="flex-1" asChild>
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
