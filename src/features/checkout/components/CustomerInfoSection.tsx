import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
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
  return (
    <Card variant="default" className="border border-[#E2DED6] bg-white p-2 sm:p-4">
      <CardHeader className="pb-4 border-b border-[#F0ECE1]">
        <div className="flex items-center gap-3">
          <Badge variant="default" size="lg" className="w-8 h-8 rounded-full justify-center p-0 font-serif font-bold text-sm bg-[#0B1938]">
            1
          </Badge>
          <div>
            <CardTitle className="font-serif text-xl font-bold text-[#0B1938]">
              Customer Information
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B] mt-0.5">
              Personal contact details for order confirmation & dispatch updates
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="checkout-first-name"
            label="First Name *"
            placeholder="e.g. Ali"
            value={customer.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            error={errors.firstName}
            autoComplete="given-name"
            required
          />
          <Input
            id="checkout-last-name"
            label="Last Name *"
            placeholder="e.g. Khan"
            value={customer.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            error={errors.lastName}
            autoComplete="family-name"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="checkout-email"
            type="email"
            label="Email Address *"
            leftIcon={<Icons.Mail className="w-4 h-4 text-[#94A3B8]" />}
            placeholder="e.g. ali.khan@example.com"
            value={customer.email}
            onChange={(e) => onChange("email", e.target.value)}
            error={errors.email}
            helperText="Order receipt and tracking will be sent here"
            autoComplete="email"
            required
          />
          <Input
            id="checkout-phone"
            type="tel"
            label="Phone Number *"
            leftIcon={<Icons.Phone className="w-4 h-4 text-[#94A3B8]" />}
            placeholder="e.g. +92 300 1234567"
            value={customer.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            error={errors.phone}
            helperText="Required by courier for delivery coordination"
            autoComplete="tel"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}

