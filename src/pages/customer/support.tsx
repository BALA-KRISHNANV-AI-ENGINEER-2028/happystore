import { Mail, MessageCircle, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/components/ui/toaster";

const contactOptions = [
  { icon: MessageCircle, title: "Live chat", description: "Avg. response time: 2 minutes", action: "Start chat" },
  { icon: Mail, title: "Email us", description: "support@happystore.com", action: "Send email" },
  { icon: Phone, title: "Call us", description: "Mon–Sun, 7am–10pm", action: "Call now" },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-display text-heading-lg font-semibold text-foreground">Support</h1>
      <p className="mb-6 text-body-sm text-foreground-muted">We're here to help with orders, deliveries, and your account.</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {contactOptions.map((opt) => (
          <Card key={opt.title} className="flex flex-col items-center gap-2 p-5 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
              <opt.icon size={18} />
            </div>
            <p className="text-body-sm font-medium text-foreground">{opt.title}</p>
            <p className="text-caption text-foreground-subtle">{opt.description}</p>
            <Button variant="secondary" size="sm" className="mt-1" onClick={() => toast(`${opt.action}…`)}>
              {opt.action}
            </Button>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 font-display text-body font-semibold text-foreground">Common questions</h2>
      <Card className="px-5">
        <Accordion type="single" collapsible>
          <AccordionItem value="missing-item">
            <AccordionTrigger>An item is missing from my order</AccordionTrigger>
            <AccordionContent>
              Contact the shop directly from your order details page, or reach our support team for a refund on the missing item.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="late-order">
            <AccordionTrigger>My order is running late</AccordionTrigger>
            <AccordionContent>
              Track live status from the Orders tab. If it's significantly delayed past the estimate, contact support for help.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="refund">
            <AccordionTrigger>How do refunds work?</AccordionTrigger>
            <AccordionContent>
              Approved refunds are issued to your original payment method and typically appear within 3–5 business days.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="change-address">
            <AccordionTrigger>Can I change my delivery address after ordering?</AccordionTrigger>
            <AccordionContent>
              You can update it within a few minutes of placing your order from the order details page, before the shop starts preparing it.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
