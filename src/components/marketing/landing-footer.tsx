import { Link } from "react-router-dom";
import { Store, Globe, MessageCircle, AtSign } from "lucide-react";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "For customers",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Browse categories", href: "#categories" },
      { label: "Gift cards", href: "#" },
      { label: "Help center", href: "#" },
    ],
  },
  {
    title: "For business",
    links: [
      { label: "Sell on Happy Store", href: "#for-business" },
      { label: "Partner support", href: "#" },
      { label: "Merchant app", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", href: "#" },
      { label: "Privacy policy", href: "#" },
      { label: "Cookie policy", href: "#" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface-sunken/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-foreground-on-primary">
                <Store size={16} strokeWidth={2.5} />
              </div>
              <span className="font-display text-body-lg font-semibold text-foreground">Happy Store</span>
            </div>
            <p className="max-w-xs text-body-sm text-foreground-muted">
              Discover local. Shop smarter. Happy Store connects you with the
              shops on your block — groceries, bakeries, pharmacies, and more.
            </p>
            <div className="mt-4 flex gap-2">
              {[Globe, MessageCircle, AtSign].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground-muted transition-colors hover:text-foreground"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-label font-semibold text-foreground">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-body-sm text-foreground-muted transition-colors hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-caption text-foreground-subtle">© {new Date().getFullYear()} Happy Store, Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/dashboard/shop" className="text-caption text-foreground-subtle hover:text-foreground">Shop owner login</Link>
            <Link to="/dashboard/admin" className="text-caption text-foreground-subtle hover:text-foreground">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
