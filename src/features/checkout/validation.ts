import { CheckoutCustomer, CheckoutAddress, PaymentMethod } from "./types";
import { getCountryConfig } from "./countries";

export interface CheckoutFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  paymentMethod?: string;
  general?: string;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return "Email address is required";
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return "Please enter a valid email address (e.g. name@example.com)";
  }
  return null;
}

export function validatePhone(phone: string, country: string): string | null {
  const digits = phone.replace(/\D/g, "");
  const config = getCountryConfig(country);

  if (!digits) {
    return "Phone number is required for courier delivery";
  }

  if (config.country === "Pakistan") {
    if (digits.length > 11) {
      return "Pakistan phone number cannot exceed 11 digits";
    }
    if (digits.startsWith("0")) {
      if (digits.length < 11) {
        return `Please enter complete 11-digit mobile number (e.g. 03001234567) - currently ${digits.length} digits`;
      }
    } else if (digits.startsWith("3")) {
      if (digits.length < 10) {
        return `Please enter complete 10-digit mobile number (e.g. 3001234567) - currently ${digits.length} digits`;
      }
    } else {
      if (digits.length < 10) {
        return "Pakistan phone number must be 10 or 11 digits (e.g. 03001234567)";
      }
    }
    return null;
  }

  // Other supported countries
  if (digits.length > config.maxDigits) {
    return `${config.country} phone number cannot exceed ${config.maxDigits} digits`;
  }
  if (digits.length < config.minDigits) {
    return `${config.country} phone number must be at least ${config.minDigits} digits`;
  }

  return null;
}

export function validateCheckoutForm(
  customer: CheckoutCustomer,
  address: CheckoutAddress,
  paymentMethod: PaymentMethod
): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  // Customer Information Validation
  if (!customer.firstName.trim()) {
    errors.firstName = "First name is required";
  } else if (customer.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  }

  if (!customer.lastName.trim()) {
    errors.lastName = "Last name is required";
  } else if (customer.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  }

  const emailErr = validateEmail(customer.email);
  if (emailErr) {
    errors.email = emailErr;
  }

  const phoneErr = validatePhone(customer.phone, address.country || "Pakistan");
  if (phoneErr) {
    errors.phone = phoneErr;
  }

  // Shipping Address Validation
  if (!address.addressLine1.trim()) {
    errors.addressLine1 = "Street address is required";
  } else if (address.addressLine1.trim().length < 3) {
    errors.addressLine1 = "Please provide a complete delivery address";
  }

  if (!address.city.trim()) {
    errors.city = "City is required";
  } else if (address.city.trim().length < 2) {
    errors.city = "Please enter a valid city name";
  }

  if (!address.state.trim()) {
    errors.state = "State or Province is required";
  } else if (address.state.trim().length < 2) {
    errors.state = "Please enter a valid state / province";
  }

  if (!address.postalCode.trim()) {
    errors.postalCode = "Postal / ZIP code is required";
  } else if (address.postalCode.trim().length < 2) {
    errors.postalCode = "Please enter a valid postal code";
  }

  if (!address.country || !address.country.trim()) {
    errors.country = "Country is required";
  }

  // Payment Method Validation
  if (!paymentMethod || !["cash_on_delivery", "bank_transfer"].includes(paymentMethod)) {
    errors.paymentMethod = "Please select a valid payment method";
  }

  return errors;
}
