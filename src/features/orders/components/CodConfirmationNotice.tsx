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
      className="p-5 sm:p-6 bg-[#FAF7EE] border border-[#C5A880]/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      role="region"
      aria-label="Cash on Delivery Information"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-full bg-[#590B16]/10 text-[#590B16] flex items-center justify-center shrink-0">
          <Icons.Cash className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-serif text-sm sm:text-base font-semibold text-stone-900">
            Cash on Delivery
          </h4>
          <p className="text-xs text-stone-600 font-sans mt-0.5">
            Please keep <strong className="font-semibold text-[#590B16]">{totalFormatted}</strong> in cash ready upon delivery of your parcel.
          </p>
        </div>
      </div>
      <span className="self-start sm:self-center shrink-0 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-sans font-semibold tracking-wider uppercase bg-[#590B16]/10 text-[#590B16] border border-[#590B16]/20">
        Pay on Delivery
      </span>
    </div>
  );
};
