"use client";

import React, { useState } from "react";
import { PaymentMethod, BankTransferSettings } from "../types";
import { Icons } from "@/components/ui/icons";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  bankSettings?: BankTransferSettings;
  codEnabled?: boolean;
  bankEnabled?: boolean;
}

export function PaymentMethodSection({
  paymentMethod,
  onChange,
  bankSettings,
  codEnabled = true,
  bankEnabled = true,
}: PaymentMethodSectionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Card variant="default" className="border border-[#E2DED6] bg-white p-2 sm:p-4">
      <CardHeader className="pb-4 border-b border-[#F0ECE1]">
        <div className="flex items-center gap-3">
          <Badge variant="default" size="lg" className="w-8 h-8 rounded-full justify-center p-0 font-serif font-bold text-sm bg-[#0B1938]">
            3
          </Badge>
          <div>
            <CardTitle className="font-serif text-xl font-bold text-[#0B1938]">
              Payment Settlement
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B] mt-0.5">
              Select your preferred secure payment method
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Cash on Delivery Option */}
        {codEnabled && (
          <label
            htmlFor="payment-cod"
            className={`block border p-5 rounded-2xl cursor-pointer transition-all duration-200 ${
              paymentMethod === "cash_on_delivery"
                ? "border-2 border-[#0B1938] bg-[#0B1938]/[0.03] shadow-xs"
                : "border-[#EFECE6] hover:border-[#CBD5E1] bg-white"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <input
                type="radio"
                id="payment-cod"
                name="paymentMethod"
                value="cash_on_delivery"
                checked={paymentMethod === "cash_on_delivery"}
                onChange={() => onChange("cash_on_delivery")}
                className="mt-1 h-4 w-4 text-[#0B1938] border-[#E2DED6] focus:ring-[#0B1938] accent-[#0B1938]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-serif text-base text-[#0B1938] font-bold tracking-wide flex items-center gap-2">
                    <Icons.Cash className="w-4 h-4 text-[#C5A880]" />
                    Cash on Delivery (COD)
                  </span>
                  <Badge variant="secondary">Handover Delivery</Badge>
                </div>
                <p className="text-xs text-[#64748B] font-sans mt-1.5 leading-relaxed">
                  Settle your order directly with our courier concierge in cash upon delivery of your sealed fragrance parcel.
                </p>
              </div>
            </div>
          </label>
        )}

        {/* Bank Transfer Option */}
        {bankEnabled && (
          <div
            className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
              paymentMethod === "bank_transfer"
                ? "border-2 border-[#0B1938] bg-[#0B1938]/[0.03] shadow-xs"
                : "border-[#EFECE6] hover:border-[#CBD5E1] bg-white"
            }`}
          >
            <label
              htmlFor="payment-bank"
              className="block p-5 cursor-pointer"
            >
              <div className="flex items-start gap-3.5">
                <input
                  type="radio"
                  id="payment-bank"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => onChange("bank_transfer")}
                  className="mt-1 h-4 w-4 text-[#0B1938] border-[#E2DED6] focus:ring-[#0B1938] accent-[#0B1938]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-serif text-base text-[#0B1938] font-bold tracking-wide flex items-center gap-2">
                      <Icons.Bank className="w-4 h-4 text-[#C5A880]" />
                      Direct Bank Transfer / IBFT
                    </span>
                    <Badge variant="default">Official Treasury</Badge>
                  </div>
                  <p className="text-xs text-[#64748B] font-sans mt-1.5 leading-relaxed">
                    Transfer funds directly to the Soulmate Scents banking account. Your order will be allocated immediately.
                  </p>
                </div>
              </div>
            </label>

            {/* Live Bank Details Display */}
            {paymentMethod === "bank_transfer" && (
              <div className="px-5 pb-5 pt-2 border-t border-[#EFECE6] bg-[#FAF8F5] mx-4 sm:mx-5 mb-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3.5 text-xs font-serif uppercase tracking-widest text-[#0B1938] font-bold">
                  <Icons.Bank className="w-4 h-4 text-[#C5A880]" />
                  <span>Official Treasury Bank Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                  <div className="p-3.5 bg-white rounded-lg border border-[#EFECE6]">
                    <span className="block text-[10px] tracking-[0.14em] uppercase text-[#64748B] font-medium mb-0.5">
                      Bank Name
                    </span>
                    <span className="font-semibold text-[#0B1938]">
                      {bankSettings?.bankName || "Meezan Bank Limited"}
                    </span>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-[#EFECE6]">
                    <span className="block text-[10px] tracking-[0.14em] uppercase text-[#64748B] font-medium mb-0.5">
                      Account Title
                    </span>
                    <span className="font-semibold text-[#0B1938]">
                      {bankSettings?.accountTitle || "Soulmate Scents Private Ltd"}
                    </span>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-[#EFECE6] flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] tracking-[0.14em] uppercase text-[#64748B] font-medium mb-0.5">
                        Account Number
                      </span>
                      <span className="font-mono font-bold text-[#0B1938]">
                        {bankSettings?.accountNumber || "01029384756123"}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(bankSettings?.accountNumber || "01029384756123", "accountNumber")}
                    >
                      {copiedField === "accountNumber" ? (
                        <Icons.Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Icons.Copy className="w-4 h-4 text-[#64748B]" />
                      )}
                    </Button>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-[#EFECE6] flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] tracking-[0.14em] uppercase text-[#64748B] font-medium mb-0.5">
                        IBAN / Swift
                      </span>
                      <span className="font-mono font-bold text-[#0B1938] text-[11px] break-all">
                        {bankSettings?.iban || "PK36MEZN0001029384756123"}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(bankSettings?.iban || "PK36MEZN0001029384756123", "iban")}
                    >
                      {copiedField === "iban" ? (
                        <Icons.Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Icons.Copy className="w-4 h-4 text-[#64748B]" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="mt-3.5 p-3.5 bg-white rounded-lg border border-[#EFECE6] text-[#475569] text-[11px] leading-relaxed">
                  <span className="font-bold text-[#0B1938] block mb-0.5">
                    Transfer Instructions:
                  </span>
                  {bankSettings?.instructions ||
                    "Please transfer the exact order amount and specify your Order Reference Number in the transaction note. Your order will be confirmed immediately."}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

