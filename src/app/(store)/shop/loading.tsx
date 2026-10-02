import React from "react";
import { Spinner } from "@/components/ui/spinner";

export default function ShopLoading() {
  return (
    <main className="w-full bg-[#FAF8F5] min-h-screen">
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" className="text-accent" />
          <p className="text-xs uppercase tracking-[0.22em] text-foreground-muted font-sans font-medium">
            Loading fragrances…
          </p>
        </div>
      </div>
    </main>
  );
}
