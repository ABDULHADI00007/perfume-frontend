"use client";

import React, { useState } from "react";
import { Icons } from "@/components/ui/icons";
import { BankTransferSettings } from "@/features/orders/types";

interface BankTransferDetailsProps {
  settings?: BankTransferSettings | null;
  orderNumber: string;
  totalFormatted: string;
}

export const BankTransferDetails: React.FC<BankTransferDetailsProps> = ({
  settings,
  orderNumber,
  totalFormatted,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldKey: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const bankName = settings?.bankName || "Standard Chartered Bank";
  const accountTitle = settings?.accountTitle || "Maison de Parfum Ltd";
  const accountNumber = settings?.accountNumber || "01029384756";
  const iban = settings?.iban || "US93SCBL00000001029384756";
  const instructions =
    settings?.instructions ||
    "Please transfer the exact order amount and reference your order number in the payment memo.";

  return (
    <div
      className="p-6 sm:p-8 bg-gradient-to-br from-[#0B1938]/5 via-[#F8F6F0] to-[#D4AF37]/5 border border-[#0B1938]/15 rounded-xl space-y-5 shadow-sm relative overflow-hidden"
      role="region"
      aria-label="Bank Wire Settlement Instructions"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-[#0B1938]/10">
        <div className="flex items-center gap-3 text-[#0B1938] font-serif uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold">
          <div className="w-8 h-8 rounded-full bg-[#0B1938] text-[#D4AF37] flex items-center justify-center shadow-md">
            <Icons.Bank className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <span>Bank Wire Settlement Instructions</span>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-sans font-semibold tracking-widest uppercase bg-[#0B1938] text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm">
          Wire Transfer Required
        </span>
      </div>

      <p className="text-xs sm:text-sm text-[#334155] font-sans leading-relaxed">
        Please initiate a direct bank wire transfer of{" "}
        <strong className="text-[#0B1938] font-semibold font-serif text-base">{totalFormatted}</strong> to our treasury account details listed below. Kindly include your Order Reference{" "}
        <strong className="font-mono text-[#0B1938] bg-[#0B1938]/10 px-2 py-0.5 rounded border border-[#0B1938]/20 font-semibold">{orderNumber}</strong> in the payment reference/memo.
      </p>

      {instructions && (
        <div className="text-xs text-[#475569] font-sans italic border-l-2 border-[#D4AF37] pl-3 py-1 bg-white/60 rounded-r">
          {instructions}
        </div>
      )}

      {/* Account Details Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans bg-white/90 p-4 sm:p-5 rounded-lg border border-[#0B1938]/10 shadow-sm backdrop-blur-sm">
        {accountTitle && (
          <div className="p-3 bg-[#F8F6F0]/60 rounded border border-[#0B1938]/5">
            <span className="text-[10px] uppercase text-[#64748B] tracking-widest font-medium block mb-1">
              Beneficiary Title
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-[#0B1938] truncate">{accountTitle}</span>
              <button
                type="button"
                onClick={() => handleCopy(accountTitle, "accountTitle")}
                aria-label={`Copy account title: ${accountTitle}`}
                className="text-[#64748B] hover:text-[#0B1938] transition-colors p-1"
              >
                {copiedField === "accountTitle" ? (
                  <span className="text-[10px] text-[#B89742] font-semibold uppercase tracking-wider">Copied</span>
                ) : (
                  <Icons.Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {bankName && (
          <div className="p-3 bg-[#F8F6F0]/60 rounded border border-[#0B1938]/5">
            <span className="text-[10px] uppercase text-[#64748B] tracking-widest font-medium block mb-1">
              Banking Institution
            </span>
            <span className="font-medium text-[#0B1938] block">{bankName}</span>
          </div>
        )}

        {accountNumber && (
          <div className="p-3 bg-[#F8F6F0]/60 rounded border border-[#0B1938]/5">
            <span className="text-[10px] uppercase text-[#64748B] tracking-widest font-medium block mb-1">
              Account Number
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-semibold text-[#0B1938]">{accountNumber}</span>
              <button
                type="button"
                onClick={() => handleCopy(accountNumber, "accountNumber")}
                aria-label={`Copy account number: ${accountNumber}`}
                className="text-[#64748B] hover:text-[#0B1938] transition-colors p-1"
              >
                {copiedField === "accountNumber" ? (
                  <span className="text-[10px] text-[#B89742] font-semibold uppercase tracking-wider">Copied</span>
                ) : (
                  <Icons.Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {iban && (
          <div className="p-3 bg-[#F8F6F0]/60 rounded border border-[#0B1938]/5">
            <span className="text-[10px] uppercase text-[#64748B] tracking-widest font-medium block mb-1">
              IBAN / SWIFT Code
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-semibold text-[#0B1938] text-[11px] truncate">
                {iban}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(iban, "iban")}
                aria-label={`Copy IBAN: ${iban}`}
                className="text-[#64748B] hover:text-[#0B1938] transition-colors p-1"
              >
                {copiedField === "iban" ? (
                  <span className="text-[10px] text-[#B89742] font-semibold uppercase tracking-wider">Copied</span>
                ) : (
                  <Icons.Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div aria-live="polite" className="sr-only">
        {copiedField ? `${copiedField} copied to clipboard` : ""}
      </div>
    </div>
  );
};
