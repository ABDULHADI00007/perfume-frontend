import { constructMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/layout/Container";

export const metadata = constructMetadata({
  title: "Terms of Service — Maison de Parfum",
  description: "Terms and conditions governing your use of the Maison de Parfum website and your purchase of our fragrances.",
  canonical: "/terms",
});

const sections = [
  {
    title: "Acceptance of Terms",
    body: "By accessing and using the Maison de Parfum website and making a purchase, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.",
  },
  {
    title: "Products & Pricing",
    body: "All product descriptions, images, and pricing are provided in good faith and subject to change without notice. We reserve the right to correct any errors in product descriptions or pricing and to cancel orders in such cases. Prices are displayed in PKR (Pakistani Rupee) unless otherwise specified.",
  },
  {
    title: "Orders & Payment",
    body: "All orders are subject to acceptance and availability. Payment is required at the time of purchase. We accept major credit cards and secure payment methods. We will confirm your order via email once payment has been processed successfully.",
  },
  {
    title: "Delivery",
    body: "We will endeavor to deliver your order within the timeframes specified at checkout. Delivery times are estimates and may vary due to circumstances beyond our control. Risk of loss and title for items pass to you upon delivery.",
  },
  {
    title: "Returns & Refunds",
    body: "We offer a 14-day returns policy for unopened, sealed products. Opened products may only be returned if they are genuinely faulty. Please see our Returns Policy page for full details on how to initiate a return.",
  },
  {
    title: "Intellectual Property",
    body: "All content on the Maison de Parfum website — including text, photography, fragrance formulations, and design — is the intellectual property of Maison de Parfum and protected by applicable copyright and trademark laws.",
  },
  {
    title: "Limitation of Liability",
    body: "Maison de Parfum shall not be liable for any indirect, incidental, or consequential damages arising from your use of our products or website. Our liability is limited to the value of the products purchased.",
  },
  {
    title: "Governing Law",
    body: "These Terms of Service are governed by the laws of Pakistan. Any disputes will be resolved through the courts of Lahore, Pakistan.",
  },
];

export default function TermsPage() {
  return (
    <main className="bg-background min-h-screen">
      <section className="border-b border-border/60 py-16 sm:py-24">
        <Container size="default">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-3 mb-6">
              <span className="w-6 h-[1px] bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-foreground-muted font-sans">Legal</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground leading-[1.1] tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-foreground-muted font-sans">Last updated: September 2026</p>
          </div>
        </Container>
      </section>
      <section className="py-16 sm:py-20">
        <Container size="narrow">
          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.title} className="pb-10 border-b border-border/50 last:border-none">
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-foreground mb-4 leading-snug">{s.title}</h2>
                <p className="text-sm sm:text-base text-foreground-muted font-sans font-light leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
