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
  const accountTitle = settings?.accountTitle || "House of Perfume Ltd";
  const accountNumber = settings?.accountNumber || "01029384756";
  const iban = settings?.iban || "US93SCBL00000001029384756";
  const instructions =
    settings?.instructions ||
    "Please transfer the exact order amount and upload your transaction receipt/screenshot.";

  return (
    <div
      className="p-6 sm:p-8 bg-accent-subtle/20 border-l-4 border-l-accent space-y-5"
      role="region"
      aria-label="Bank Wire Settlement Instructions"
    >
      <div className="flex items-center gap-2.5 text-primary font-serif uppercase tracking-widest text-sm font-semibold">
        <Icons.Bank className="w-4 h-4 text-accent" />
        <span>Bank Wire Settlement Instructions</span>
      </div>

      <p className="text-xs text-foreground-muted font-sans leading-relaxed">
        Please initiate a bank wire transfer of{" "}
        <strong className="text-foreground font-semibold">{totalFormatted}</strong> to the
        treasury account listed below. Kindly ensure you include your Order Reference{" "}
        <strong className="font-mono text-primary font-semibold">{orderNumber}</strong> in your
        wire transfer reference or description.
      </p>

      {instructions && (
        <div className="text-xs text-foreground-muted font-sans italic border-l border-accent/40 pl-3 py-1">
          {instructions}
        </div>
      )}

      {/* Account Details Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans bg-surface p-4 sm:p-5 border border-border">
        {accountTitle && (
          <div>
            <span className="text-[10px] uppercase text-foreground-subtle tracking-wider block mb-0.5">
              Account Title / Beneficiary
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-foreground truncate">{accountTitle}</span>
              <button
                type="button"
                onClick={() => handleCopy(accountTitle, "accountTitle")}
                aria-label={`Copy account title: ${accountTitle}`}
                className="text-foreground-subtle hover:text-primary transition-colors p-1"
              >
                {copiedField === "accountTitle" ? (
                  <span className="text-[10px] text-accent font-medium uppercase tracking-wider">Copied</span>
                ) : (
                  <Icons.Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {bankName && (
          <div>
            <span className="text-[10px] uppercase text-foreground-subtle tracking-wider block mb-0.5">
              Bank Institution
            </span>
            <span className="font-medium text-foreground block">{bankName}</span>
          </div>
        )}

        {accountNumber && (
          <div>
            <span className="text-[10px] uppercase text-foreground-subtle tracking-wider block mb-0.5">
              Account Number
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-medium text-foreground">{accountNumber}</span>
              <button
                type="button"
                onClick={() => handleCopy(accountNumber, "accountNumber")}
                aria-label={`Copy account number: ${accountNumber}`}
                className="text-foreground-subtle hover:text-primary transition-colors p-1"
              >
                {copiedField === "accountNumber" ? (
                  <span className="text-[10px] text-accent font-medium uppercase tracking-wider">Copied</span>
                ) : (
                  <Icons.Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {iban && (
          <div>
            <span className="text-[10px] uppercase text-foreground-subtle tracking-wider block mb-0.5">
              IBAN / SWIFT
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-medium text-foreground text-[11px] truncate">
                {iban}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(iban, "iban")}
                aria-label={`Copy IBAN: ${iban}`}
                className="text-foreground-subtle hover:text-primary transition-colors p-1"
              >
                {copiedField === "iban" ? (
                  <span className="text-[10px] text-accent font-medium uppercase tracking-wider">Copied</span>
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
