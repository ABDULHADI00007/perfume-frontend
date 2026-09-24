"use client";

import React, { useState } from "react";
import { PaymentMethod, BankTransferSettings } from "../types";
import { Icons } from "@/components/ui/icons";

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
    <section className="bg-white border border-[#EFECE6] p-6 sm:p-8 rounded-2xl shadow-sm transition-all">
      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-[#EFECE6]">
        <span className="w-7 h-7 rounded-full bg-[#0B1938] text-white flex items-center justify-center text-xs font-serif font-bold shadow-xs">
          3
        </span>
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0B1938] uppercase tracking-wider">
            Payment Method
          </h2>
          <p className="text-xs text-[#64748B] font-sans mt-0.5">
            Select your preferred settlement method
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Cash on Delivery Option */}
        {codEnabled && (
          <label
            htmlFor="payment-cod"
            className={`block border p-5 rounded-xl cursor-pointer transition-all duration-200 ${
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
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base text-[#0B1938] font-bold tracking-wide">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full border border-[#EFECE6] bg-[#F8F6F0] text-[#0B1938]">
                    Handover
                  </span>
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
            className={`border rounded-xl transition-all duration-200 overflow-hidden ${
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
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base text-[#0B1938] font-bold tracking-wide">
                      Direct Bank Transfer / Wire
                    </span>
                    <span className="text-[10px] font-semibold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full border border-[#0B1938]/20 bg-[#0B1938] text-white">
                      Treasury
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] font-sans mt-1.5 leading-relaxed">
                    Transfer funds directly to the Maison de Parfum banking account. Your order will be prepared and allocated immediately.
                  </p>
                </div>
              </div>
            </label>

            {/* Live Bank Details Display (Accordion/Card when selected) */}
            {paymentMethod === "bank_transfer" && (
              <div className="px-5 pb-5 pt-2 border-t border-[#EFECE6] bg-[#F8F6F0] mx-4 sm:mx-5 mb-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3.5 text-xs font-serif uppercase tracking-widest text-[#0B1938] font-bold">
                  <Icons.Bank className="w-4 h-4 text-[#0B1938]" />
                  <span>Maison Official Treasury Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                  <div className="p-3.5 bg-white rounded-lg border border-[#EFECE6]">
                    <span className="block text-[10px] tracking-[0.14em] uppercase text-[#64748B] font-medium mb-0.5">
                      Bank Name
                    </span>
                    <span className="font-semibold text-[#0B1938]">
                      {bankSettings?.bankName || "Standard Chartered Bank"}
                    </span>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-[#EFECE6]">
                    <span className="block text-[10px] tracking-[0.14em] uppercase text-[#64748B] font-medium mb-0.5">
                      Account Title
                    </span>
                    <span className="font-semibold text-[#0B1938]">
                      {bankSettings?.accountTitle || "Maison de Parfum Ltd"}
                    </span>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-[#EFECE6] flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] tracking-[0.14em] uppercase text-[#64748B] font-medium mb-0.5">
                        Account Number
                      </span>
                      <span className="font-mono font-bold text-[#0B1938]">
                        {bankSettings?.accountNumber || "01029384756"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankSettings?.accountNumber || "01029384756", "accountNumber")}
                      aria-label="Copy account number"
                      className="p-1.5 text-[#64748B] hover:text-[#0B1938] hover:bg-[#F8F6F0] rounded-md transition-colors"
                    >
                      {copiedField === "accountNumber" ? (
                        <Icons.Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Icons.Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-[#EFECE6] flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] tracking-[0.14em] uppercase text-[#64748B] font-medium mb-0.5">
                        IBAN / SWIFT
                      </span>
                      <span className="font-mono font-bold text-[#0B1938] text-[11px] break-all">
                        {bankSettings?.iban || "US93SCBL00000001029384756"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankSettings?.iban || "US93SCBL00000001029384756", "iban")}
                      aria-label="Copy IBAN"
                      className="p-1.5 text-[#64748B] hover:text-[#0B1938] hover:bg-[#F8F6F0] rounded-md transition-colors"
                    >
                      {copiedField === "iban" ? (
                        <Icons.Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Icons.Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-3.5 p-3.5 bg-white rounded-lg border border-[#EFECE6] text-[#475569] text-[11px] leading-relaxed">
                  <span className="font-bold text-[#0B1938] block mb-0.5">
                    Wire Instructions:
                  </span>
                  {bankSettings?.instructions ||
                    "Please transfer the exact order total and use your unique Order Reference Number in the transfer memo. You will receive your reference number immediately upon clicking Place Order."}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
