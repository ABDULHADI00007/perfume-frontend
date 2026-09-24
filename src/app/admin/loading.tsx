import React from "react";
import { Spinner } from "@/components/ui/spinner";

export default function AdminLoading() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-20 bg-background">
      <div className="text-center flex flex-col items-center">
        <Spinner size="lg" className="text-navy mb-3" label="Loading Admin Console..." />
        <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted font-sans font-medium">
          Maison de Parfum Administration
        </p>
      </div>
    </div>
  );
}
