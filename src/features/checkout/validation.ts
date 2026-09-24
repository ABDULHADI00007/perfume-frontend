import { CheckoutCustomer, CheckoutAddress, PaymentMethod } from "./types";

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  if (!customer.email.trim()) {
    errors.email = "Email address is required";
  } else if (!EMAIL_REGEX.test(customer.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!customer.phone.trim()) {
    errors.phone = "Phone number is required for courier delivery";
  } else if (customer.phone.trim().replace(/\D/g, "").length < 7) {
    errors.phone = "Please enter a valid phone number (at least 7 digits)";
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

  if (!address.country.trim()) {
    errors.country = "Country is required";
  }

  // Payment Method Validation
  if (!paymentMethod || !["cash_on_delivery", "bank_transfer"].includes(paymentMethod)) {
    errors.paymentMethod = "Please select a valid payment method";
  }

  return errors;
}
