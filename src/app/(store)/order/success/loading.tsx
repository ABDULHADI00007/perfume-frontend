import React from "react";
import { Container } from "@/components/layout/Container";
import { Spinner } from "@/components/ui/spinner";

export default function OrderSuccessLoading() {
  return (
    <main className="bg-background min-h-screen py-16 sm:py-24">
      <Container size="default">
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size="lg" className="text-accent mb-4" />
          <p className="text-xs uppercase tracking-[0.22em] text-foreground-muted font-sans font-medium">
            Loading order details…
          </p>
        </div>
      </Container>
    </main>
  );
}
