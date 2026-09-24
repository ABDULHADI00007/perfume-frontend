import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectOption } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckoutAddress } from "../types";
import { CheckoutFormErrors } from "../validation";

interface ShippingAddressSectionProps {
  address: CheckoutAddress;
  onChange: (field: keyof CheckoutAddress, value: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  errors: CheckoutFormErrors;
}

const COUNTRY_OPTIONS: SelectOption[] = [
  { label: "Pakistan", value: "Pakistan" },
  { label: "United Arab Emirates", value: "United Arab Emirates" },
  { label: "Saudi Arabia", value: "Saudi Arabia" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "United States", value: "United States" },
  { label: "Canada", value: "Canada" },
];

export function ShippingAddressSection({
  address,
  onChange,
  notes,
  onNotesChange,
  errors,
}: ShippingAddressSectionProps) {
  const inputClass = "rounded-xl border-[#E2DED6] bg-[#F8F6F0]/50 focus:bg-white focus:border-[#0B1938] focus:ring-[#0B1938] text-[#0B1938] placeholder:text-[#94A3B8] h-11 transition-all";

  return (
    <section className="bg-white border border-[#EFECE6] p-6 sm:p-8 rounded-2xl shadow-sm transition-all">
      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-[#EFECE6]">
        <span className="w-7 h-7 rounded-full bg-[#0B1938] text-white flex items-center justify-center text-xs font-serif font-bold shadow-xs">
          2
        </span>
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0B1938] uppercase tracking-wider">
            Shipping Destination
          </h2>
          <p className="text-xs text-[#64748B] font-sans mt-0.5">
            White-glove courier delivery address
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          id="checkout-address-1"
          label="Street Address"
          placeholder="e.g. House #12, Block H-3, Johar Town"
          value={address.addressLine1}
          onChange={(e) => onChange("addressLine1", e.target.value)}
          error={errors.addressLine1}
          autoComplete="street-address"
          className={inputClass}
          required
        />

        <Input
          id="checkout-address-2"
          label="Apartment, Suite, Unit (Optional)"
          placeholder="e.g. Apt 4B, Gulberg Heights"
          value={address.addressLine2 || ""}
          onChange={(e) => onChange("addressLine2", e.target.value)}
          autoComplete="address-line2"
          className={inputClass}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            id="checkout-city"
            label="City"
            placeholder="e.g. Lahore"
            value={address.city}
            onChange={(e) => onChange("city", e.target.value)}
            error={errors.city}
            autoComplete="address-level2"
            className={inputClass}
            required
          />

          <Input
            id="checkout-state"
            label="State / Province"
            placeholder="e.g. Punjab"
            value={address.state}
            onChange={(e) => onChange("state", e.target.value)}
            error={errors.state}
            autoComplete="address-level1"
            className={inputClass}
            required
          />

          <Input
            id="checkout-postal-code"
            label="Postal / ZIP Code"
            placeholder="e.g. 54000"
            value={address.postalCode}
            onChange={(e) => onChange("postalCode", e.target.value)}
            error={errors.postalCode}
            autoComplete="postal-code"
            className={inputClass}
            required
          />
        </div>

        <Select
          id="checkout-country"
          label="Country / Region"
          value={address.country}
          onChange={(e) => onChange("country", e.target.value)}
          error={errors.country}
          options={COUNTRY_OPTIONS}
          className={inputClass}
        />

        {/* Gift Message / Special Delivery Instructions */}
        <div className="pt-2">
          <Textarea
            id="checkout-notes"
            label="Gift Message / Delivery Instructions (Optional)"
            rows={3}
            maxLength={500}
            placeholder="Add a handwritten gift message or courier access instructions..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            helperText="Max 500 characters. Complimentary calligraphy gift card included upon request."
            className="rounded-xl border-[#E2DED6] bg-[#F8F6F0]/50 focus:bg-white focus:border-[#0B1938] focus:ring-[#0B1938] text-[#0B1938] placeholder:text-[#94A3B8] transition-all"
          />
        </div>
      </div>
    </section>
  );
}

