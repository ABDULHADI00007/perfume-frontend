import { constructMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/layout/Container";

export const metadata = constructMetadata({
  title: "Shipping & Delivery — Maison de Parfum",
  description: "Shipping methods, delivery timelines, and packaging standards for Maison de Parfum orders worldwide.",
  canonical: "/shipping",
});

const shippingOptions = [
  { method: "Domestic Standard", time: "3–5 business days", cost: "PKR 350 / Free over PKR 5,000" },
  { method: "Domestic Express", time: "1–2 business days", cost: "PKR 750" },
  { method: "International Standard", time: "7–14 business days", cost: "From USD 25 / Free over USD 150" },
  { method: "International Express", time: "3–5 business days", cost: "From USD 55" },
];

export default function ShippingPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <section className="border-b border-border/60 py-16 sm:py-24">
        <Container size="default">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-3 mb-6">
              <span className="w-6 h-[1px] bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-foreground-muted font-sans">Delivery</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground leading-[1.1] tracking-tight mb-4">
              Shipping & Delivery
            </h1>
            <p className="text-sm text-foreground-muted font-sans">
              Every Maison de Parfum order is packaged with archival tissue, a wax seal, and a personal handwritten note from our team.
            </p>
          </div>
        </Container>
      </section>

      {/* Shipping Options Table */}
      <section className="py-16 sm:py-20 border-b border-border/60">
        <Container size="default">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mb-8 tracking-tight">
            Delivery Options
          </h2>
          <div className="border border-border">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-surface-subtle border-b border-border px-6 py-3">
              {["Method", "Estimated Time", "Cost"].map((col) => (
                <span key={col} className="text-[10px] uppercase tracking-[0.18em] font-semibold text-foreground-muted font-sans">
                  {col}
                </span>
              ))}
            </div>
            {/* Rows */}
            {shippingOptions.map((option, i) => (
              <div
                key={option.method}
                className={`grid grid-cols-3 px-6 py-5 ${i < shippingOptions.length - 1 ? "border-b border-border/60" : ""}`}
              >
                <span className="font-sans text-sm font-medium text-foreground">{option.method}</span>
                <span className="font-sans text-sm text-foreground-muted">{option.time}</span>
                <span className="font-sans text-sm text-foreground-muted">{option.cost}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Info Sections */}
      <section className="py-16 sm:py-20">
        <Container size="narrow">
          <div className="space-y-10">
            {[
              {
                title: "Order Processing",
                body: "All orders are processed within 1–2 business days of payment confirmation. Orders placed on weekends or public holidays will be processed on the following business day. You will receive an email confirmation with tracking details once your order has been dispatched.",
              },
              {
                title: "Packaging",
                body: "Every order is presented in our signature gift packaging: archival tissue paper, a hand-applied wax seal bearing the Maison de Parfum emblem, and a personal handwritten note. Orders of two or more flacons are presented in our signature linen-lined presentation box at no extra charge.",
              },
              {
                title: "International Customs & Duties",
                body: "International orders may be subject to customs duties and import taxes levied by the destination country. These charges are the responsibility of the recipient and are not included in our shipping fees. We comply with all international fragrance shipping regulations.",
              },
              {
                title: "Damaged or Lost Orders",
                body: "In the rare event that your order arrives damaged or is lost in transit, please contact our concierge team at concierge@maisondeparfum.com within 48 hours of the expected delivery date. We will investigate and arrange a replacement or refund as appropriate.",
              },
            ].map((s) => (
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
