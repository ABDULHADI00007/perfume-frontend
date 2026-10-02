import React from "react";
import { Icons } from "@/components/ui/icons";

interface CodConfirmationNoticeProps {
  totalFormatted: string;
}

export const CodConfirmationNotice: React.FC<CodConfirmationNoticeProps> = ({
  totalFormatted,
}) => {
  return (
    <div
      className="p-6 sm:p-8 bg-gradient-to-br from-[#0B1938]/5 via-[#F8F6F0] to-[#D4AF37]/5 border border-[#0B1938]/15 rounded-xl space-y-4 shadow-sm relative overflow-hidden"
      role="region"
      aria-label="Cash on Delivery Settlement"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-[#0B1938]/10">
        <div className="flex items-center gap-3 text-[#0B1938] font-serif uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold">
          <div className="w-8 h-8 rounded-full bg-[#0B1938] text-[#D4AF37] flex items-center justify-center shadow-md">
            <Icons.Cash className="w-4 h-4" />
          </div>
          <span>Cash on Delivery Settlement</span>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-sans font-semibold tracking-widest uppercase bg-[#0B1938] text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm">
          Settlement Due Upon Handover
        </span>
      </div>

      <p className="text-xs sm:text-sm text-[#334155] font-sans leading-relaxed">
        Your bespoke order has been registered and queued for master perfumer dispatch. Please prepare the exact amount of{" "}
        <strong className="text-[#0B1938] font-semibold font-serif text-base">{totalFormatted}</strong> in cash for payment to our white-glove courier upon physical parcel handover.
      </p>

      <div className="flex items-start gap-3 text-xs text-[#475569] font-sans bg-white/80 p-3.5 rounded-lg border border-[#0B1938]/10 backdrop-blur-sm">
        <Icons.Info className="w-4 h-4 text-[#B89742] flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          Our authorized courier will present an official dispatch receipt upon parcel delivery. Please verify the tamper-evident security seal before completing the cash handover.
        </span>
      </div>
    </div>
  );
};
