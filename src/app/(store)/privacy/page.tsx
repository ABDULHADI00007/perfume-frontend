import { constructMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/layout/Container";

export const metadata = constructMetadata({
  title: "Privacy Policy — Soulmate Scents",
  description:
    "Soulmate Scents's privacy policy. How we collect, use, and protect your personal information.",
  canonical: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <section className="border-b border-border/60 py-16 sm:py-24">
        <Container size="default">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-3 mb-6">
              <span className="w-6 h-[1px] bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-foreground-muted font-sans">
                Legal
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground leading-[1.1] tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-foreground-muted font-sans">
              Last updated: September 2026
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <Container size="narrow">
          <div className="prose-luxury space-y-10">
            {[
              {
                title: "Information We Collect",
                body: "We collect information you provide directly, including your name, email address, shipping address, and payment details. We also collect information about how you interact with our website, including pages viewed and search queries, to improve your experience.",
              },
              {
                title: "How We Use Your Information",
                body: "We use your information to process and fulfill your orders, communicate with you about your orders and enquiries, personalise your experience, send you newsletters and exclusive offers if you have subscribed, and comply with legal obligations.",
              },
              {
                title: "Data Security",
                body: "We employ industry-standard security measures to protect your personal data. All payment information is encrypted and processed through PCI-DSS compliant payment processors. We never store full credit card numbers on our systems.",
              },
              {
                title: "Cookies",
                body: "We use essential cookies to operate our website and optional analytics cookies to understand how our site is used. You may disable non-essential cookies through your browser settings. Disabling essential cookies may impair the functionality of your shopping experience.",
              },
              {
                title: "Data Sharing",
                body: "We do not sell or rent your personal information to third parties. We share data only with trusted service providers (shipping carriers, payment processors) as required to fulfill your orders, and only to the extent necessary.",
              },
              {
                title: "Your Rights",
                body: "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please contact our concierge team at concierge@maisondeparfum.com. We will respond within 30 days.",
              },
              {
                title: "Contact",
                body: "If you have any questions about this Privacy Policy, please contact our Data Privacy team at privacy@maisondeparfum.com or write to us at 12 Rue du Faubourg, Grasse, France.",
              },
            ].map((section) => (
              <div key={section.title} className="pb-10 border-b border-border/50 last:border-none">
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-foreground mb-4 leading-snug">
                  {section.title}
                </h2>
                <p className="text-sm sm:text-base text-foreground-muted font-sans font-light leading-relaxed">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
