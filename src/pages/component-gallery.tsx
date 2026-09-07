import { useState } from "react";
import {
  Moon, Sun, Heart, Bell, Truck, CheckCircle2, TrendingUp,
  ShoppingBag, Sandwich, Coffee, Carrot, Search as SearchIcon, Inbox, AlertTriangle,
} from "lucide-react";
import { HappyStoreLogo } from "@/components/brand/happy-store-logo";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchBar } from "@/components/ui/search-bar";
import { toast } from "@/components/ui/toaster";
import { ShopCard } from "@/components/commerce/shop-card";
import { ProductCard } from "@/components/commerce/product-card";
import { CategoryCard } from "@/components/commerce/category-card";
import { ReviewCard } from "@/components/commerce/review-card";
import { OrderCard } from "@/components/commerce/order-card";
import { NotificationCard } from "@/components/commerce/notification-card";
import { AnalyticsCard } from "@/components/commerce/analytics-card";

function ThemeToggle() {
  const { resolvedTheme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground-muted transition-colors hover:text-foreground hover:border-border-strong"
    >
      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

function Section({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <div className="mb-6 max-w-2xl">
        <p className="mb-2 font-mono text-caption uppercase tracking-[0.14em] text-foreground-subtle">{eyebrow}</p>
        <h2 className="text-heading-md text-foreground">{title}</h2>
        {description && <p className="mt-2 text-body-sm text-foreground-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default function ComponentGalleryPage() {
  const [page, setPage] = useState(3);
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState(true);
  const [category, setCategory] = useState("groceries");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <HappyStoreLogo size={32} />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-16">
          <p className="mb-3 font-mono text-caption uppercase tracking-[0.14em] text-accent-strong">
            Phase 2 · Reusable component library
          </p>
          <h1 className="max-w-xl font-display text-display-sm font-semibold leading-tight text-foreground">
            Built once. Used everywhere.
          </h1>
          <p className="mt-4 max-w-md text-body text-foreground-muted">
            Every primitive below is composed entirely from Phase 1 tokens — no
            one-off colors or spacing values.
          </p>
        </div>

        <Section eyebrow="Actions · 01" title="Buttons">
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-5">
            <Button variant="primary">Add to cart</Button>
            <Button variant="accent">Claim offer</Button>
            <Button variant="secondary">Save for later</Button>
            <Button variant="outline">View shop</Button>
            <Button variant="ghost">Dismiss</Button>
            <Button variant="destructive">Cancel order</Button>
            <Button variant="link">See all</Button>
            <Button variant="primary" loading>Placing order</Button>
            <Button variant="primary" size="icon" aria-label="Favorite"><Heart size={16} /></Button>
          </div>
        </Section>

        <Section eyebrow="Actions · 02" title="Badges &amp; chips">
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="neutral">Neutral</Badge>
              <Badge tone="primary">Primary</Badge>
              <Badge tone="accent">Accent</Badge>
              <Badge tone="success">In stock</Badge>
              <Badge tone="warning">Low stock</Badge>
              <Badge tone="error">Out of stock</Badge>
              <Badge tone="info">New</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip selected>Groceries</Chip>
              <Chip>Bakery</Chip>
              <Chip>Pharmacy</Chip>
              <Chip onRemove={() => toast("Filter removed")}>Under $20 ✕</Chip>
            </div>
          </div>
        </Section>

        <Section eyebrow="People" title="Avatars">
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-surface p-5">
            <Avatar fallback="AL" size="sm" />
            <Avatar fallback="JM" size="md" presence="online" />
            <Avatar fallback="RK" size="lg" presence="offline" />
            <Avatar fallback="SP" size="xl" />
          </div>
        </Section>

        <Section eyebrow="Forms" title="Inputs, select &amp; checkbox">
          <div className="grid gap-5 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Jordan Rivera" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="cat"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="bakery">Bakery</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="note">Delivery note</Label>
              <Textarea id="note" placeholder="Leave at the front desk" />
            </div>
            <label className="flex items-center gap-2.5 sm:col-span-2">
              <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
              <span className="text-body-sm text-foreground">Save this address for next time</span>
            </label>
          </div>
        </Section>

        <Section eyebrow="Navigation" title="Search, tabs &amp; pagination">
          <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-5">
            <SearchBar
              placeholder="Search shops or products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open now</TabsTrigger>
                <TabsTrigger value="offers">Offers</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="text-body-sm text-foreground-muted">
                Showing every nearby shop, sorted by distance.
              </TabsContent>
              <TabsContent value="open" className="text-body-sm text-foreground-muted">
                Only shops currently accepting orders.
              </TabsContent>
              <TabsContent value="offers" className="text-body-sm text-foreground-muted">
                Shops with an active promotion today.
              </TabsContent>
            </Tabs>
            <Pagination page={page} totalPages={8} onPageChange={setPage} />
          </div>
        </Section>

        <Section eyebrow="Overlays" title="Dialog, drawer &amp; dropdown">
          <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-surface p-5">
            <Dialog>
              <DialogTrigger asChild><Button variant="secondary">Cancel order</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel this order?</DialogTitle>
                  <DialogDescription>Corner Market has already started preparing your items. This can't be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="ghost">Keep order</Button>
                  <Button variant="destructive">Cancel order</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Drawer>
              <DrawerTrigger asChild><Button variant="secondary">Filter results</Button></DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Filter shops</DrawerTitle>
                  <DrawerDescription>Refine by distance, rating, and category.</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-wrap gap-2 px-5">
                  <Chip selected>Open now</Chip>
                  <Chip>4+ stars</Chip>
                  <Chip>Under 1 mi</Chip>
                </div>
                <DrawerFooter>
                  <Button variant="primary">Apply filters</Button>
                  <DrawerClose asChild><Button variant="ghost">Cancel</Button></DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline">Sort by</Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort orders</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Distance</DropdownMenuItem>
                <DropdownMenuItem>Rating</DropdownMenuItem>
                <DropdownMenuItem>Delivery time</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={() => toast.success("Order confirmed", { description: "Corner Market is preparing your order." })}>
              Trigger toast
            </Button>
          </div>
        </Section>

        <Section eyebrow="Data" title="Table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono">#ES-10482</TableCell>
                <TableCell>Corner Market</TableCell>
                <TableCell><Badge tone="success">Delivered</Badge></TableCell>
                <TableCell className="font-mono">$24.10</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">#ES-10481</TableCell>
                <TableCell>Rivera Bakery</TableCell>
                <TableCell><Badge tone="info">On the way</Badge></TableCell>
                <TableCell className="font-mono">$11.50</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">#ES-10479</TableCell>
                <TableCell>Green Leaf Pharmacy</TableCell>
                <TableCell><Badge tone="warning">Preparing</Badge></TableCell>
                <TableCell className="font-mono">$38.90</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Section>

        <Section eyebrow="States" title="Loading, empty &amp; error">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <EmptyState
              icon={<Inbox size={20} />}
              title="No orders yet"
              description="Your past orders will show up here."
              action={<Button variant="secondary" size="sm">Browse shops</Button>}
            />
            <EmptyState
              tone="error"
              icon={<AlertTriangle size={20} />}
              title="Couldn't load results"
              description="Check your connection and try again."
              action={<Button variant="outline" size="sm">Retry</Button>}
            />
          </div>
        </Section>

        <Section
          eyebrow="Commerce · 01"
          title="Shop &amp; product cards"
          description="The signature proximity chip carries through the shop card; product cards stay dense for fast browsing."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <ShopCard name="Corner Market" category="Grocery · Convenience" rating={4.8} reviewCount={212} distance="0.4 mi" promoted />
            <ShopCard name="Rivera Bakery" category="Bakery · Cafe" rating={4.6} reviewCount={98} distance="0.7 mi" />
            <ShopCard name="Green Leaf Pharmacy" category="Pharmacy" rating={4.4} reviewCount={54} distance="1.1 mi" open={false} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <ProductCard name="Organic Whole Milk, 1 Gal" shopName="Corner Market" price={4.29} unit="gal" onAdd={() => toast("Added to cart")} />
            <ProductCard name="Sourdough Loaf" shopName="Rivera Bakery" price={6.5} compareAtPrice={7.5} onAdd={() => toast("Added to cart")} />
            <ProductCard name="Allergy Relief, 30ct" shopName="Green Leaf Pharmacy" price={12.99} outOfStock />
          </div>
        </Section>

        <Section eyebrow="Commerce · 02" title="Categories">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <CategoryCard label="Groceries" icon={Carrot} count={38} selected />
            <CategoryCard label="Bakery" icon={Sandwich} count={12} />
            <CategoryCard label="Cafe" icon={Coffee} count={9} />
            <CategoryCard label="General" icon={ShoppingBag} count={21} />
          </div>
        </Section>

        <Section eyebrow="Commerce · 03" title="Reviews, orders &amp; notifications">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-5">
              <ReviewCard authorName="Priya S." authorInitials="PS" rating={5} date="2d ago" comment="Fast delivery and everything was fresh. My go-to for weekly groceries now." />
              <ReviewCard authorName="Marcus T." authorInitials="MT" rating={4} date="1w ago" comment="Great selection, wish they had more organic options." />
            </div>
            <div className="flex flex-col gap-3">
              <OrderCard orderId="10482" shopName="Corner Market" itemSummary="Milk, eggs, sourdough +2 more" total={24.1} status="on_the_way" placedAt="Today, 2:14 PM" />
              <OrderCard orderId="10471" shopName="Green Leaf Pharmacy" itemSummary="Allergy relief, vitamins" total={38.9} status="delivered" placedAt="Jul 6" />
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-border bg-surface p-2">
            <NotificationCard icon={Truck} title="Your order is on the way" description="Corner Market · arriving in 12 minutes" time="2 min ago" unread tone="accent" />
            <NotificationCard icon={CheckCircle2} title="Order delivered" description="Green Leaf Pharmacy" time="3 days ago" tone="success" />
            <NotificationCard icon={Bell} title="New offer nearby" description="15% off at Rivera Bakery this week" time="1 week ago" tone="warning" />
          </div>
        </Section>

        <Section eyebrow="Commerce · 04" title="Analytics">
          <div className="grid gap-4 sm:grid-cols-3">
            <AnalyticsCard label="Revenue today" value="$1,284" change={12.4} icon={TrendingUp} sparkline={[4, 6, 5, 8, 7, 10, 9, 12]} />
            <AnalyticsCard label="Orders today" value="86" change={-3.1} icon={ShoppingBag} sparkline={[10, 9, 11, 8, 9, 7, 8, 7]} />
            <AnalyticsCard label="Avg. rating" value="4.7" change={1.2} icon={SearchIcon} sparkline={[4.5, 4.6, 4.6, 4.7, 4.6, 4.7, 4.8, 4.7]} />
          </div>
        </Section>
      </main>

      <footer className="border-t border-border py-8">
        <p className="mx-auto max-w-5xl px-6 font-mono text-caption text-foreground-subtle">
          Happy Store component library — Phase 2 of 13
        </p>
      </footer>
    </div>
  );
}
