import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { CheckoutCustomer } from "../types";
import { CheckoutFormErrors, validateEmail, validatePhone } from "../validation";
import { COUNTRIES, CountryConfig, getCountryConfig } from "../countries";

interface CustomerInfoSectionProps {
  customer: CheckoutCustomer;
  onChange: (field: keyof CheckoutCustomer, value: string) => void;
  errors: CheckoutFormErrors;
  onSetFieldError: (field: keyof CheckoutFormErrors, error: string | undefined) => void;
  country: string;
  onCountryChange: (country: string) => void;
}

export function CustomerInfoSection({
  customer,
  onChange,
  errors,
  onSetFieldError,
  country,
  onCountryChange,
}: CustomerInfoSectionProps) {
  const currentConfig: CountryConfig = getCountryConfig(country);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (selectedCountry: CountryConfig) => {
    onCountryChange(selectedCountry.country);
    setIsDropdownOpen(false);

    // If existing phone digits exceed new country's max digits, trim it
    if (customer.phone.length > selectedCountry.maxDigits) {
      const trimmed = customer.phone.slice(0, selectedCountry.maxDigits);
      onChange("phone", trimmed);
      const err = validatePhone(trimmed, selectedCountry.country);
      onSetFieldError("phone", err || undefined);
    } else if (customer.phone.length > 0) {
      const err = validatePhone(customer.phone, selectedCountry.country);
      onSetFieldError("phone", err || undefined);
    }
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers (0-9)
    const rawDigits = e.target.value.replace(/\D/g, "");
    // Strictly cap at maxDigits (e.g. 11 digits for Pakistan)
    const cappedDigits = rawDigits.slice(0, currentConfig.maxDigits);

    onChange("phone", cappedDigits);

    // Immediate error feedback if already in error state
    if (errors.phone) {
      const err = validatePhone(cappedDigits, country);
      onSetFieldError("phone", err || undefined);
    }
  };

  const handlePhoneBlur = () => {
    const err = validatePhone(customer.phone, country);
    onSetFieldError("phone", err || undefined);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange("email", val);
    if (errors.email) {
      const err = validateEmail(val);
      onSetFieldError("email", err || undefined);
    }
  };

  const handleEmailBlur = () => {
    const err = validateEmail(customer.email);
    onSetFieldError("email", err || undefined);
  };

  const handleNameBlur = (field: "firstName" | "lastName", val: string, label: string) => {
    if (!val.trim()) {
      onSetFieldError(field, `${label} is required`);
    } else if (val.trim().length < 2) {
      onSetFieldError(field, `${label} must be at least 2 characters`);
    } else {
      onSetFieldError(field, undefined);
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
            1
          </Badge>
          <div>
            <CardTitle className="font-serif text-xl font-bold text-black">
              Customer Information
            </CardTitle>
            <CardDescription className="text-xs text-stone-500 mt-0.5">
              Personal contact details for order confirmation & dispatch updates
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="checkout-first-name"
            label="First Name *"
            placeholder="e.g. Ali"
            value={customer.firstName}
            onChange={(e) => {
              onChange("firstName", e.target.value);
              if (errors.firstName && e.target.value.trim().length >= 2) {
                onSetFieldError("firstName", undefined);
              }
            }}
            onBlur={() => handleNameBlur("firstName", customer.firstName, "First name")}
            error={errors.firstName}
            autoComplete="given-name"
            required
          />
          <Input
            id="checkout-last-name"
            label="Last Name *"
            placeholder="e.g. Khan"
            value={customer.lastName}
            onChange={(e) => {
              onChange("lastName", e.target.value);
              if (errors.lastName && e.target.value.trim().length >= 2) {
                onSetFieldError("lastName", undefined);
              }
            }}
            onBlur={() => handleNameBlur("lastName", customer.lastName, "Last name")}
            error={errors.lastName}
            autoComplete="family-name"
            required
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email Address */}
          <div>
            <Input
              id="checkout-email"
              type="email"
              label="Email Address *"
              leftIcon={<Icons.Mail className="w-4 h-4 text-[#94A3B8]" />}
              placeholder="e.g. ali.khan@example.com"
              value={customer.email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              error={errors.email}
              helperText="Order receipt and tracking will be sent here"
              autoComplete="email"
              required
            />
          </div>

          {/* Phone Number with Country Code Dropdown */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="checkout-phone-input"
                className="block text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-[#0B1938]"
              >
                Phone Number *
              </label>
              <span className="text-[10px] font-mono text-stone-500">
                {customer.phone.length}/{currentConfig.maxDigits} digits
              </span>
            </div>

            <div className="relative flex items-center w-full">
              {/* Country Dial Code */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  id="checkout-phone-country-btn"
                  onClick={() => COUNTRIES.length > 1 && setIsDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 h-10 px-3 rounded-l-xl border border-r-0 text-xs font-sans font-medium transition-all focus:outline-none ${
                    COUNTRIES.length <= 1 ? "cursor-default" : "hover:bg-[#F2EFE9]"
                  } ${
                    errors.phone
                      ? "border-rose-500 bg-rose-50/30 text-rose-900"
                      : "border-[#E6E2EA] bg-[#FAF9F6] text-[#0B1938]"
                  }`}
                  aria-label="Country Dial Code"
                  title={`${currentConfig.country} (${currentConfig.dialCode})`}
                >
                  <span className="font-semibold text-xs tracking-tight text-stone-800">
                    {currentConfig.dialCode}
                  </span>
                  {COUNTRIES.length > 1 && (
                    <Icons.ChevronDown className="w-3 h-3 text-stone-400 shrink-0 ml-0.5" />
                  )}
                </button>

                {/* Country Code Dropdown Popover */}
                {isDropdownOpen && COUNTRIES.length > 1 && (
                  <div className="absolute left-0 top-full mt-1.5 z-50 w-72 rounded-xl border border-[#E6E2EA] bg-white shadow-xl py-1 animate-in fade-in-0 zoom-in-95">
                    <div className="px-3 py-1.5 border-b border-[#F0ECE1] text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      Select Country & Dial Code
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-stone-100">
                      {COUNTRIES.map((c) => {
                        const isSelected = c.country === currentConfig.country;
                        return (
                          <button
                            key={c.country}
                            type="button"
                            onClick={() => handleCountrySelect(c)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left transition-colors ${
                              isSelected
                                ? "bg-[#590B16]/10 text-[#590B16] font-semibold"
                                : "text-stone-700 hover:bg-stone-50"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="truncate">{c.country}</span>
                            </div>
                            <span className="font-mono text-xs text-stone-500 font-medium shrink-0 ml-2">
                              {c.dialCode}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Number Input Field */}
              <div className="relative flex-1">
                <input
                  id="checkout-phone-input"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={currentConfig.maxDigits}
                  placeholder={currentConfig.placeholder}
                  value={customer.phone}
                  onChange={handlePhoneInputChange}
                  onBlur={handlePhoneBlur}
                  className={`flex h-10 w-full rounded-r-xl border border-[#E6E2EA] bg-white px-3.5 py-2 text-xs font-sans text-[#0B1938] shadow-2xs transition-all placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.phone
                      ? "border-rose-500 focus-visible:ring-rose-500/20 focus-visible:border-rose-500 bg-rose-50/20"
                      : "focus-visible:ring-[#0C134F]/20 focus-visible:border-[#0C134F]"
                  }`}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            {/* Error or Helper Message */}
            {errors.phone ? (
              <p className="text-[11px] text-rose-600 font-medium mt-1.5 font-sans flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{errors.phone}</span>
              </p>
            ) : (
              <p className="text-[11px] text-stone-500 mt-1.5 font-sans flex items-center justify-between">
                <span>
                  {currentConfig.country === "Pakistan"
                    ? "Pakistan number: 11 digits max (e.g. 03001234567)"
                    : `${currentConfig.country}: ${currentConfig.formatHelp}`}
                </span>
                <span className="text-[10px] text-stone-400">Required for courier</span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
