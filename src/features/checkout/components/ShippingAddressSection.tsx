import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectOption } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckoutAddress } from "../types";
import { CheckoutFormErrors } from "../validation";
import { COUNTRIES } from "../countries";

interface ShippingAddressSectionProps {
  address: CheckoutAddress;
  onChange: (field: keyof CheckoutAddress, value: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  errors: CheckoutFormErrors;
  onSetFieldError: (field: keyof CheckoutFormErrors, error: string | undefined) => void;
}

const COUNTRY_OPTIONS: SelectOption[] = COUNTRIES.map((c) => ({
  label: `${c.flag}  ${c.country}`,
  value: c.country,
}));

export function ShippingAddressSection({
  address,
  onChange,
  notes,
  onNotesChange,
  errors,
  onSetFieldError,
}: ShippingAddressSectionProps) {
  const handleAddressBlur = (field: keyof CheckoutAddress, minLength: number, fieldName: string) => {
    const val = (address[field] || "").trim();
    if (!val) {
      onSetFieldError(field as keyof CheckoutFormErrors, `${fieldName} is required`);
    } else if (val.length < minLength) {
      onSetFieldError(field as keyof CheckoutFormErrors, `Please enter a valid ${fieldName.toLowerCase()}`);
    } else {
      onSetFieldError(field as keyof CheckoutFormErrors, undefined);
    }
  };

  return (
    <Card variant="default" className="border border-[#E2DED6] bg-white p-2 sm:p-4">
      <CardHeader className="pb-4 border-b border-[#F0ECE1]">
        <div className="flex items-center gap-3">
          <Badge
            variant="default"
            size="lg"
            className="w-8 h-8 rounded-full justify-center p-0 font-serif font-bold text-sm bg-[#590B16] text-white"
          >
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
        {/* Street Address */}
        <Input
          id="checkout-address-1"
          label="Street Address *"
          placeholder="e.g. House #12, Block H-3, Johar Town"
          value={address.addressLine1}
          onChange={(e) => {
            onChange("addressLine1", e.target.value);
            if (errors.addressLine1 && e.target.value.trim().length >= 3) {
              onSetFieldError("addressLine1", undefined);
            }
          }}
          onBlur={() => handleAddressBlur("addressLine1", 3, "Street address")}
          error={errors.addressLine1}
          autoComplete="street-address"
          required
        />

        {/* Apartment (Optional) */}
        <Input
          id="checkout-address-2"
          label="Apartment, Suite, Unit (Optional)"
          placeholder="e.g. Apt 4B, Gulberg Heights"
          value={address.addressLine2 || ""}
          onChange={(e) => onChange("addressLine2", e.target.value)}
          autoComplete="address-line2"
        />

        {/* City, State, Postal Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            id="checkout-city"
            label="City *"
            placeholder="e.g. Lahore"
            value={address.city}
            onChange={(e) => {
              onChange("city", e.target.value);
              if (errors.city && e.target.value.trim().length >= 2) {
                onSetFieldError("city", undefined);
              }
            }}
            onBlur={() => handleAddressBlur("city", 2, "City")}
            error={errors.city}
            autoComplete="address-level2"
            required
          />

          <Input
            id="checkout-state"
            label="State / Province *"
            placeholder="e.g. Punjab"
            value={address.state}
            onChange={(e) => {
              onChange("state", e.target.value);
              if (errors.state && e.target.value.trim().length >= 2) {
                onSetFieldError("state", undefined);
              }
            }}
            onBlur={() => handleAddressBlur("state", 2, "State or province")}
            error={errors.state}
            autoComplete="address-level1"
            required
          />

          <Input
            id="checkout-postal-code"
            label="Postal / ZIP Code *"
            placeholder="e.g. 54000"
            value={address.postalCode}
            onChange={(e) => {
              onChange("postalCode", e.target.value);
              if (errors.postalCode && e.target.value.trim().length >= 2) {
                onSetFieldError("postalCode", undefined);
              }
            }}
            onBlur={() => handleAddressBlur("postalCode", 2, "Postal / ZIP code")}
            error={errors.postalCode}
            autoComplete="postal-code"
            required
          />
        </div>

        {/* Country / Region */}
        <Select
          id="checkout-country"
          label="Country / Region *"
          value={address.country}
          onChange={(e) => {
            const newCountry = e.target.value;
            onChange("country", newCountry);
            if (errors.country && newCountry.trim()) {
              onSetFieldError("country", undefined);
            }
          }}
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
