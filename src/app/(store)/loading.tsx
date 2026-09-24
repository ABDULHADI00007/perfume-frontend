import React from "react";
import { Container } from "@/components/layout/Container";
import { Spinner } from "@/components/ui/spinner";

export default function StorefrontLoading() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-24 bg-background">
      <Container size="narrow" className="text-center flex flex-col items-center justify-center">
        <Spinner size="lg" className="text-accent mb-4" label="Loading Maison de Parfum..." />
        <p className="text-xs uppercase tracking-[0.22em] text-foreground-muted font-sans font-medium">
          Maison de Parfum
        </p>
      </Container>
    </div>
  );
}
