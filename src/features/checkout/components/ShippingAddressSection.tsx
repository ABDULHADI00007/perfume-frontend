import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectOption } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  return (
    <Card variant="default" className="border border-[#E2DED6] bg-white p-2 sm:p-4">
      <CardHeader className="pb-4 border-b border-[#F0ECE1]">
        <div className="flex items-center gap-3">
          <Badge variant="default" size="lg" className="w-8 h-8 rounded-full justify-center p-0 font-serif font-bold text-sm bg-[#590B16] text-white">
            2
          </Badge>
          <div>
            <CardTitle className="font-serif text-xl font-bold text-black">
              Shipping Destination
            </CardTitle>
            <CardDescription className="text-xs text-stone-500 mt-0.5">
              White-glove courier delivery location & instructions
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <Input
          id="checkout-address-1"
          label="Street Address *"
          placeholder="e.g. House #12, Block H-3, Johar Town"
          value={address.addressLine1}
          onChange={(e) => onChange("addressLine1", e.target.value)}
          error={errors.addressLine1}
          autoComplete="street-address"
          required
        />

        <Input
          id="checkout-address-2"
          label="Apartment, Suite, Unit (Optional)"
          placeholder="e.g. Apt 4B, Gulberg Heights"
          value={address.addressLine2 || ""}
          onChange={(e) => onChange("addressLine2", e.target.value)}
          autoComplete="address-line2"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            id="checkout-city"
            label="City *"
            placeholder="e.g. Lahore"
            value={address.city}
            onChange={(e) => onChange("city", e.target.value)}
            error={errors.city}
            autoComplete="address-level2"
            required
          />

          <Input
            id="checkout-state"
            label="State / Province *"
            placeholder="e.g. Punjab"
            value={address.state}
            onChange={(e) => onChange("state", e.target.value)}
            error={errors.state}
            autoComplete="address-level1"
            required
          />

          <Input
            id="checkout-postal-code"
            label="Postal / ZIP Code *"
            placeholder="e.g. 54000"
            value={address.postalCode}
            onChange={(e) => onChange("postalCode", e.target.value)}
            error={errors.postalCode}
            autoComplete="postal-code"
            required
          />
        </div>

        <Select
          id="checkout-country"
          label="Country / Region *"
          value={address.country}
          onChange={(e) => onChange("country", e.target.value)}
          error={errors.country}
          options={COUNTRY_OPTIONS}
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
          />
        </div>
      </CardContent>
    </Card>
  );
}


