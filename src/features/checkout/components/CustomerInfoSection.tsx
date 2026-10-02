import React from "react";
import { Input } from "@/components/ui/input";
import { CheckoutCustomer } from "../types";
import { CheckoutFormErrors } from "../validation";

interface CustomerInfoSectionProps {
  customer: CheckoutCustomer;
  onChange: (field: keyof CheckoutCustomer, value: string) => void;
  errors: CheckoutFormErrors;
}

export function CustomerInfoSection({
  customer,
  onChange,
  errors,
}: CustomerInfoSectionProps) {
  const inputClass = "rounded-xl border-[#E2DED6] bg-[#F8F6F0]/50 focus:bg-white focus:border-[#0B1938] focus:ring-[#0B1938] text-[#0B1938] placeholder:text-[#94A3B8] h-11 transition-all";

  return (
    <section className="bg-white border border-gray-200/80 p-7 sm:p-9 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.1)] transition-all duration-300">
      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-[#EFECE6]">
        <span className="w-7 h-7 rounded-full bg-[#0B1938] text-white flex items-center justify-center text-xs font-serif font-bold shadow-xs">
          1
        </span>
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0B1938] uppercase tracking-wider">
            Customer Information
          </h2>
          <p className="text-xs text-[#64748B] font-sans mt-0.5">
            Your personal order details and dispatch updates
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="checkout-first-name"
            label="First Name"
            placeholder="e.g. Ali"
            value={customer.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            error={errors.firstName}
            autoComplete="given-name"
            className={inputClass}
            required
          />
          <Input
            id="checkout-last-name"
            label="Last Name"
            placeholder="e.g. Khan"
            value={customer.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            error={errors.lastName}
            autoComplete="family-name"
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="checkout-email"
            type="email"
            label="Email Address"
            placeholder="e.g. ali.khan@example.com"
            value={customer.email}
            onChange={(e) => onChange("email", e.target.value)}
            error={errors.email}
            helperText="Order receipt and tracking will be sent here"
            autoComplete="email"
            className={inputClass}
            required
          />
          <Input
            id="checkout-phone"
            type="tel"
            label="Phone Number"
            placeholder="e.g. +92 300 1234567"
            value={customer.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            error={errors.phone}
            helperText="Required by courier for delivery coordination"
            autoComplete="tel"
            className={inputClass}
            required
          />
        </div>
      </div>
    </section>
  );
}
