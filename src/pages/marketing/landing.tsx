import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin, ArrowRight, Carrot, Sandwich, Coffee, Pill, ShoppingBag, Utensils,
  ShieldCheck, Clock, Wallet, Heart, Search as SearchIcon, PackageCheck,
  Truck as TruckIcon, Percent, Gift, Mail, Store as StoreIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LandingHeader } from "@/components/marketing/landing-header";
import { LandingFooter } from "@/components/marketing/landing-footer";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { CategoryCard } from "@/components/commerce/category-card";
import { ShopCard } from "@/components/commerce/shop-card";
import { ProductCard } from "@/components/commerce/product-card";
import { OfferCard } from "@/components/commerce/offer-card";
import { FeatureCard } from "@/components/marketing/feature-card";
import { StepCard } from "@/components/marketing/step-card";
import { TestimonialCard } from "@/components/marketing/testimonial-card";

function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto mb-10 max-w-xl text-center" : "mb-10 max-w-xl"}>
      <p className="mb-2 font-mono text-caption font-medium uppercase tracking-[0.14em] text-primary">
        {eyebrow}
      </p>
      <h2 className="font-display text-heading-lg font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-3 text-body text-foreground-muted">{description}</p>}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <Badge tone="accent" className="mb-5">Now live in 40+ neighborhoods</Badge>
          <h1 className="font-display text-display-sm font-semibold leading-tight text-foreground sm:text-display-lg">
            Discover local.
            <br />
            Shop smarter.
          </h1>
          <p className="mt-5 max-w-md text-body-lg text-foreground-muted">
            Groceries, bakeries, pharmacies, and everything else on your
            block — compared, ordered, and delivered in minutes.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 rounded-xl border border-border bg-surface p-2.5 shadow-sm sm:flex-row">
            <div className="relative flex flex-1 items-center">
              <MapPin size={16} className="pointer-events-none absolute left-3.5 text-foreground-subtle" />
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="h-11 border-0 pl-10 shadow-none focus-visible:border-0"
              />
            </div>
            <Button variant="primary" size="lg" asChild>
              <Link to="/shops">
                Find shops near me <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-caption text-foreground-subtle">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} /> Verified local shops</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={14} /> Avg. 22 min delivery</span>
            <span className="inline-flex items-center gap-1.5"><Wallet size={14} /> No markup pricing</span>
          </div>
        </div>

        <HeroVisual />
      </section>

      {/* Popular categories */}
      <section id="categories" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading eyebrow="Browse" title="Popular categories" center={false} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <CategoryCard label="Groceries" icon={Carrot} count={38} />
          <CategoryCard label="Bakery" icon={Sandwich} count={12} />
          <CategoryCard label="Cafe" icon={Coffee} count={9} />
          <CategoryCard label="Pharmacy" icon={Pill} count={15} />
          <CategoryCard label="General" icon={ShoppingBag} count={21} />
          <CategoryCard label="Dining" icon={Utensils} count={27} />
        </div>
      </section>

      {/* Featured shops */}
      <section id="featured-shops" className="border-y border-border bg-surface-sunken/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 font-mono text-caption font-medium uppercase tracking-[0.14em] text-primary">Nearby</p>
              <h2 className="font-display text-heading-lg font-semibold text-foreground">Featured shops</h2>
            </div>
            <Button variant="link" asChild>
              <Link to="/shops">See all <ArrowRight size={14} /></Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ShopCard name="Corner Market" category="Grocery · Convenience" rating={4.8} reviewCount={212} distance="0.4 mi" promoted onClick={() => navigate("/shops/corner-market")} />
            <ShopCard name="Rivera Bakery" category="Bakery · Cafe" rating={4.6} reviewCount={98} distance="0.7 mi" onClick={() => navigate("/shops/rivera-bakery")} />
            <ShopCard name="Green Leaf Pharmacy" category="Pharmacy" rating={4.4} reviewCount={54} distance="1.1 mi" onClick={() => navigate("/shops/green-leaf-pharmacy")} />
          </div>
        </div>
      </section>

      {/* Trending products */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading eyebrow="Popular this week" title="Trending products" center={false} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <ProductCard name="Organic Whole Milk, 1 Gal" shopName="Corner Market" price={4.29} unit="gal" />
          <ProductCard name="Sourdough Loaf" shopName="Rivera Bakery" price={6.5} compareAtPrice={7.5} />
          <ProductCard name="Cold Brew Concentrate" shopName="Corner Market" price={8.99} />
          <ProductCard name="Allergy Relief, 30ct" shopName="Green Leaf Pharmacy" price={12.99} />
        </div>
      </section>

      {/* Special offers */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading eyebrow="Deals" title="Special offers" center={false} />
        <div className="grid gap-4 sm:grid-cols-3">
          <OfferCard icon={Percent} title="15% off your first order" description="New to Happy Store? Save on any shop, any category." code="WELCOME15" tone="accent" />
          <OfferCard icon={TruckIcon} title="Free delivery over $35" description="Stack it with any other offer at participating shops." tone="primary" />
          <OfferCard icon={Gift} title="Refer a neighbor" description="You both get $10 credit when they place their first order." code="INVITE10" tone="accent" />
        </div>
      </section>

      {/* Why Happy Store */}
      <section className="border-y border-border bg-surface-sunken/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionHeading eyebrow="Why Happy Store" title="Built for your neighborhood" description="Every design decision favors the shops down the street over big-box warehouses." />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={StoreIcon} title="Truly local" description="Every listing is an independent shop within a few miles of you." />
            <FeatureCard icon={SearchIcon} title="Compare instantly" description="See prices across nearby stores before you buy." />
            <FeatureCard icon={Clock} title="Fast delivery" description="Most orders arrive in well under 30 minutes." />
            <FeatureCard icon={Heart} title="Support your block" description="More of every dollar stays with the shop owners you love." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading eyebrow="How it works" title="Order in three steps" />
        <div className="grid gap-4 sm:grid-cols-3">
          <StepCard step={1} icon={SearchIcon} title="Search your block" description="Enter your address to see every shop nearby, open now." />
          <StepCard step={2} icon={PackageCheck} title="Pick and order" description="Compare prices, add items from multiple shops, checkout once." />
          <StepCard step={3} icon={TruckIcon} title="Track and receive" description="Follow your order live from prep to your doorstep." />
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border bg-surface-sunken/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionHeading eyebrow="Neighbors say" title="Loved by shoppers and shop owners" />
          <div className="grid gap-5 sm:grid-cols-3">
            <TestimonialCard
              quote="Fast delivery and everything was fresh. My go-to for weekly groceries now."
              name="Priya S."
              initials="PS"
              role="Customer, 2 years"
              rating={5}
            />
            <TestimonialCard
              quote="Happy Store brought in customers who'd never have found our bakery otherwise."
              name="Marcus Rivera"
              initials="MR"
              role="Owner, Rivera Bakery"
              rating={5}
            />
            <TestimonialCard
              quote="Comparing prices across three shops before ordering saves me real money every week."
              name="Alicia T."
              initials="AT"
              role="Customer, 8 months"
              rating={4}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <SectionHeading eyebrow="Questions" title="Frequently asked questions" />
        <Accordion type="single" collapsible>
          <AccordionItem value="areas">
            <AccordionTrigger>What areas does Happy Store deliver to?</AccordionTrigger>
            <AccordionContent>
              We're live in over 40 neighborhoods and growing every month. Enter
              your address on the homepage to see shops available near you.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="fees">
            <AccordionTrigger>Are there delivery fees?</AccordionTrigger>
            <AccordionContent>
              Delivery fees vary by shop and distance, and are waived entirely
              on orders over $35. You'll always see the fee before checkout.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="pickup">
            <AccordionTrigger>Can I pick up my order instead?</AccordionTrigger>
            <AccordionContent>
              Yes — every shop supports pickup alongside delivery, and pickup
              orders never carry a delivery fee.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="business">
            <AccordionTrigger>How do I list my shop on Happy Store?</AccordionTrigger>
            <AccordionContent>
              Apply from the "For business" link in our footer. Most shops go
              live within 48 hours of approval.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* For business */}
      <section id="for-business" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-primary/25 bg-primary-soft px-6 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <p className="mb-1.5 font-mono text-caption font-medium uppercase tracking-[0.14em] text-primary-strong">For shop owners</p>
            <h3 className="font-display text-heading-md font-semibold text-foreground">Own a local shop? Join Happy Store.</h3>
            <p className="mt-2 max-w-md text-body-sm text-foreground-muted">
              Reach neighbors already searching for what you sell — no listing fees to get started.
            </p>
          </div>
          <Button variant="primary" size="lg" className="shrink-0" asChild>
            <Link to="/dashboard/shop">Start selling</Link>
          </Button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-14 text-center sm:px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
            <Mail size={18} />
          </div>
          <h3 className="font-display text-heading-md font-semibold text-foreground">Get offers from shops near you</h3>
          <p className="max-w-sm text-body-sm text-foreground-muted">
            One email a week. Local deals only — unsubscribe anytime.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-sm flex-col gap-2.5 sm:flex-row"
          >
            <Input type="email" required placeholder="you@example.com" className="h-11" />
            <Button type="submit" variant="primary" className="h-11 shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
