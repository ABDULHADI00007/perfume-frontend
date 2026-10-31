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

  const bankName = settings?.bankName || "Meezan Bank / HBL";
  const accountTitle = settings?.accountTitle || "Soulmate Scents";
  const accountNumber = settings?.accountNumber || "01029384756";
  const iban = settings?.iban || "PK93MEZN00000001029384756";
  const instructions =
    settings?.instructions ||
    "Please transfer the exact order amount and reference your order number in the payment memo.";

  return (
    <div
      className="p-5 sm:p-6 bg-[#FAF7EE] border border-[#C5A880]/30 rounded-xl space-y-4 shadow-xs"
      role="region"
      aria-label="Bank Wire Transfer Instructions"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-[#C5A880]/20">
        <div className="flex items-center gap-3 text-stone-900 font-serif text-sm sm:text-base font-semibold">
          <div className="w-9 h-9 rounded-full bg-[#590B16]/10 text-[#590B16] flex items-center justify-center">
            <Icons.Bank className="w-4 h-4 text-[#590B16]" />
          </div>
          <span>Bank Transfer Instructions</span>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-sans font-semibold tracking-wider uppercase bg-[#590B16]/10 text-[#590B16] border border-[#590B16]/20">
          Transfer Required
        </span>
      </div>

      <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
        Please transfer <strong className="text-[#590B16] font-semibold font-serif text-base">{totalFormatted}</strong> to the account details below, using Order Reference <strong className="font-mono text-[#590B16] bg-[#590B16]/10 px-2 py-0.5 rounded font-semibold">{orderNumber}</strong> in the memo.
      </p>

      {instructions && (
        <div className="text-xs text-stone-600 font-sans italic border-l-2 border-[#C5A880] pl-3 py-1 bg-white/70 rounded-r">
          {instructions}
        </div>
      )}

      {/* Account Details Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans bg-white p-4 rounded-lg border border-stone-200">
        {accountTitle && (
          <div className="p-2.5 bg-[#FAF8F5] rounded border border-stone-200/60">
            <span className="text-[10px] uppercase text-stone-500 tracking-wider font-semibold block mb-0.5">
              Account Title
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-stone-900 truncate">{accountTitle}</span>
              <button
                type="button"
                onClick={() => handleCopy(accountTitle, "accountTitle")}
                aria-label={`Copy account title: ${accountTitle}`}
                className="text-stone-400 hover:text-[#590B16] transition-colors p-1"
              >
                {copiedField === "accountTitle" ? (
                  <span className="text-[10px] text-[#590B16] font-semibold uppercase tracking-wider">Copied</span>
                ) : (
                  <Icons.Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {bankName && (
          <div className="p-2.5 bg-[#FAF8F5] rounded border border-stone-200/60">
            <span className="text-[10px] uppercase text-stone-500 tracking-wider font-semibold block mb-0.5">
              Bank Name
            </span>
            <span className="font-medium text-stone-900 block">{bankName}</span>
          </div>
        )}

        {accountNumber && (
          <div className="p-2.5 bg-[#FAF8F5] rounded border border-stone-200/60">
            <span className="text-[10px] uppercase text-stone-500 tracking-wider font-semibold block mb-0.5">
              Account Number
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-semibold text-stone-900">{accountNumber}</span>
              <button
                type="button"
                onClick={() => handleCopy(accountNumber, "accountNumber")}
                aria-label={`Copy account number: ${accountNumber}`}
                className="text-stone-400 hover:text-[#590B16] transition-colors p-1"
              >
                {copiedField === "accountNumber" ? (
                  <span className="text-[10px] text-[#590B16] font-semibold uppercase tracking-wider">Copied</span>
                ) : (
                  <Icons.Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {iban && (
          <div className="p-2.5 bg-[#FAF8F5] rounded border border-stone-200/60">
            <span className="text-[10px] uppercase text-stone-500 tracking-wider font-semibold block mb-0.5">
              IBAN
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-semibold text-stone-900 text-[11px] truncate">
                {iban}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(iban, "iban")}
                aria-label={`Copy IBAN: ${iban}`}
                className="text-stone-400 hover:text-[#590B16] transition-colors p-1"
              >
                {copiedField === "iban" ? (
                  <span className="text-[10px] text-[#590B16] font-semibold uppercase tracking-wider">Copied</span>
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
