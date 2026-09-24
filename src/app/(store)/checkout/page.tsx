import { constructMetadata } from "@/lib/seo/metadata";
import { CheckoutPageView } from "@/features/checkout/components/CheckoutPageView";

export const metadata = constructMetadata({
  title: "Checkout",
  description: "Complete your luxury fragrance order with Maison de Parfum.",
  canonical: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutPageView />;
}
