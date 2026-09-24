import React from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/layout/Container";
import { CartPageView } from "@/features/cart/components/CartPageView";

export const metadata = constructMetadata({
  title: "Shopping Bag",
  description: "Review your selected luxury fragrances and proceed to checkout.",
  canonical: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <main className="pt-3 sm:pt-5 pb-12 sm:pb-16 bg-[#F8F6F0] min-h-screen">
      <Container size="wide">
        <CartPageView />
      </Container>
    </main>
  );
}
