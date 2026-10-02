import React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Spinner } from "@/components/ui/spinner";

export default function StorefrontLoading() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-24 bg-background">
      <Container size="narrow" className="text-center flex flex-col items-center justify-center space-y-4">
        <Image
          src="/images/perfumes/soulmate_logo_transparent.png"
          alt="Soulmate Scents"
          width={180}
          height={48}
          priority
          className="h-12 w-auto object-contain mb-2"
        />
        <Spinner size="lg" className="text-accent mb-2" label="Loading Soulmate Scents..." />
        <p className="text-xs uppercase tracking-[0.22em] text-foreground-muted font-sans font-medium">
          Soulmate Scents
        </p>
      </Container>
    </div>
  );
}
