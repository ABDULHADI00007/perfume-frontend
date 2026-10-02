import { constructMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/layout/Container";

export const metadata = constructMetadata({
  title: "Returns & Exchanges — Soulmate Scents",
  description: "Soulmate Scents's returns and exchanges policy. 14-day returns on unopened flacons.",
  canonical: "/returns",
});

export default function ReturnsPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <section className="border-b border-border/60 py-16 sm:py-24">
        <Container size="default">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-3 mb-6">
              <span className="w-6 h-[1px] bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-foreground-muted font-sans">Policy</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground leading-[1.1] tracking-tight mb-4">
              Returns & Exchanges
            </h1>
            <p className="text-sm text-foreground-muted font-sans font-light leading-relaxed max-w-xl">
              We want you to be completely satisfied with every Maison de Parfum purchase. If for any reason you are not, we are here to help.
            </p>
          </div>
        </Container>
      </section>

      {/* Key Policy Cards */}
      <section className="py-16 border-b border-border/60">
        <Container size="default">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { stat: "14 Days", label: "Returns Window", desc: "From date of delivery" },
              { stat: "100%", label: "Refund Guaranteed", desc: "On all eligible returns" },
              { stat: "Free", label: "Return Shipping", desc: "On damaged or faulty items" },
            ].map((item) => (
              <div key={item.label} className="p-8 border border-border/80 bg-surface text-center">
                <p className="font-serif text-3xl text-navy font-normal mb-1">{item.stat}</p>
                <p className="text-[11px] uppercase tracking-[0.18em] font-medium text-foreground font-sans mb-1">{item.label}</p>
                <p className="text-xs text-foreground-muted font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Policy Details */}
      <section className="py-16 sm:py-20">
        <Container size="narrow">
          <div className="space-y-10">
            {[
              {
                title: "Eligibility for Returns",
                body: "We accept returns on unopened, sealed flacons within 14 days of delivery. Due to the intimate nature of fragrance, products that have been opened or used cannot be returned unless they arrive damaged or are genuinely faulty.",
              },
              {
                title: "Damaged or Faulty Items",
                body: "If your order arrives damaged or you believe a product is faulty, please contact our concierge team within 48 hours of delivery. Provide photographs of the item and its packaging, and we will arrange an immediate replacement or full refund at no cost to you.",
              },
              {
                title: "How to Initiate a Return",
                body: "To initiate a return, please email concierge@maisondeparfum.com with your order number and reason for return. Our team will respond within 24 hours with a Return Merchandise Authorization (RMA) and return shipping instructions.",
              },
              {
                title: "Refund Process",
                body: "Once we receive and inspect your return, we will process your refund within 3–5 business days. Refunds are credited to the original payment method. Please allow an additional 3–5 business days for your bank to process the credit.",
              },
              {
                title: "Exchanges",
                body: "We are happy to exchange an unopened product for a different fragrance of equal or greater value. If exchanging for a higher-priced item, you will be charged the difference. If exchanging for a lower-priced item, the difference will be refunded.",
              },
              {
                title: "Gift Orders",
                body: "If you received a Maison de Parfum fragrance as a gift and would like to return or exchange it, please contact our concierge team. We will be happy to assist with a discreet exchange or store credit.",
              },
            ].map((s) => (
              <div key={s.title} className="pb-10 border-b border-border/50 last:border-none">
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-foreground mb-4 leading-snug">{s.title}</h2>
                <p className="text-sm sm:text-base text-foreground-muted font-sans font-light leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 border border-border bg-surface-subtle text-center">
            <h3 className="font-serif text-xl font-normal text-foreground mb-3">
              Need to make a return?
            </h3>
            <p className="text-sm text-foreground-muted font-sans font-light mb-5 max-w-sm mx-auto">
              Contact our concierge and we will guide you through the process.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center font-sans font-medium uppercase px-7 py-3.5 text-xs tracking-[0.2em] bg-primary text-primary-foreground hover:bg-primary-hover transition-colors duration-200 cursor-pointer"
            >
              Contact Concierge
            </a>
          </div>
        </Container>
      </section>
    </main>
  );
}
