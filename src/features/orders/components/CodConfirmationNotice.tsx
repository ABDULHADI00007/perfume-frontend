import React from "react";
import { Icons } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";

interface CodConfirmationNoticeProps {
  totalFormatted: string;
}

export const CodConfirmationNotice: React.FC<CodConfirmationNoticeProps> = ({
  totalFormatted,
}) => {
  return (
    <div
      className="p-6 sm:p-8 bg-surface-subtle/50 border-l-4 border-l-primary space-y-4"
      role="region"
      aria-label="Cash on Delivery Instructions"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5 text-primary font-serif uppercase tracking-widest text-sm font-semibold">
          <Icons.Cash className="w-4 h-4 text-primary" />
          <span>Cash on Delivery Settlement</span>
        </div>
        <Badge variant="neutral" size="sm">
          Payment Due Upon Delivery
        </Badge>
      </div>

      <p className="text-xs text-foreground-muted font-sans leading-relaxed">
        Your bespoke order has been successfully queued for preparation. Please prepare the exact
        sum of <strong className="text-foreground font-semibold">{totalFormatted}</strong> in cash
        for payment to the authorized courier upon parcel handover.
      </p>

      <div className="flex items-start gap-2.5 text-[11px] text-foreground-subtle font-sans pt-1">
        <Icons.Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <span>
          An authorized courier will present an official dispatch receipt upon parcel delivery.
          Inspect the security seal before completing the cash handover.
        </span>
      </div>
    </div>
  );
};
