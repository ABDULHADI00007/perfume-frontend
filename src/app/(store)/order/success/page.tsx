import { Suspense } from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { OrderSuccessView } from "@/features/orders/components/OrderSuccessView";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/Container";

export const metadata = constructMetadata({
  title: "Order Confirmation | Maison de Parfum",
  description: "Thank you for your order with Maison de Parfum.",
  noIndex: true,
});

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-16">
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
            <div className="border border-border p-8 space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </Container>
      }
    >
      <OrderSuccessView />
    </Suspense>
  );
}
