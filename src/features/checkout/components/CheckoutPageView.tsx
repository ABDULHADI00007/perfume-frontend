"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/hooks/useCart";
import { allProducts } from "@/features/products/data/products";
import { CustomerInfoSection } from "./CustomerInfoSection";
import { ShippingAddressSection } from "./ShippingAddressSection";
import { PaymentMethodSection } from "./PaymentMethodSection";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";
import { CheckoutEmptyState } from "./CheckoutEmptyState";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import {
  CheckoutCustomer,
  CheckoutAddress,
  PaymentMethod,
  StoreSettingsData,
  CouponValidationData,
  CreateOrderPayload,
} from "../types";
import { validateCheckoutForm, CheckoutFormErrors } from "../validation";
import { checkoutService } from "../services/checkoutService";
import { Container } from "@/components/layout/Container";

export function CheckoutPageView() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  // Store Settings (shipping fees, thresholds, bank transfer details)
  const [storeSettings, setStoreSettings] = useState<StoreSettingsData | null>(null);
  const [, setLoadingSettings] = useState(true);

  // Form State
  const [customer, setCustomer] = useState<CheckoutCustomer>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [address, setAddress] = useState<CheckoutAddress>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");
  const [notes, setNotes] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationData | null>(null);

  // Validation & Submission State
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState("");

  // Initialize Idempotency Key
  useEffect(() => {
    setIdempotencyKey(`ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  // Fetch Public Store Settings on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const res = await checkoutService.getStoreSettings();
        if (res.success && res.data && isMounted) {
          setStoreSettings(res.data);
        }
      } catch {
        // Use luxury fallback defaults if settings fetch fails
      } finally {
        if (isMounted) setLoadingSettings(false);
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCustomerChange = (field: keyof CheckoutCustomer, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof CheckoutFormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof CheckoutFormErrors];
        return next;
      });
    }
  };

  const handleAddressChange = (field: keyof CheckoutAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    const errorKey = field as keyof CheckoutFormErrors;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  // Helper to resolve exact SKU from cart item or products catalog
  const resolveSku = (
    productId: string,
    variantId?: string,
    size?: string,
    itemSku?: string
  ): string => {
    if (itemSku && itemSku !== "DEFAULT" && itemSku !== "STD-50") {
      return itemSku;
    }
    const product = allProducts.find((p) => p.id === productId);
    if (!product) return itemSku || "SI-50";

    if (variantId) {
      const matchVariant = product.variants.find((v) => v.id === variantId);
      if (matchVariant?.sku) return matchVariant.sku;
    }

    if (size) {
      const matchSize = product.variants.find(
        (v) => v.size.toLowerCase() === size.toLowerCase()
      );
      if (matchSize?.sku) return matchSize.sku;
    }

    return product.variants[0]?.sku || itemSku || "SI-50";
  };

  const handleSubmitOrder = async () => {
    setSubmitError(null);

    // 1. Run Client-side Validation
    const validationErrors = validateCheckoutForm(customer, address, paymentMethod);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitError("Please correct the highlighted fields before placing your order.");
      // Scroll to top error
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    if (cart.items.length === 0) {
      setSubmitError("Your shopping bag is empty. Please add fragrances before proceeding.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateOrderPayload = {
        customer: {
          name: `${customer.firstName.trim()} ${customer.lastName.trim()}`,
          email: customer.email.trim(),
          phone: customer.phone.trim(),
        },
        items: cart.items.map((item) => ({
          productId: item.productId,
          sku: resolveSku(item.productId, item.variantId, item.size, item.sku),
          name: item.title,
          size: item.size,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
          fullName: `${customer.firstName.trim()} ${customer.lastName.trim()}`,
          phone: customer.phone.trim(),
          addressLine1: address.addressLine1.trim(),
          addressLine2: address.addressLine2?.trim() || undefined,
          city: address.city.trim(),
          state: address.state.trim(),
          postalCode: address.postalCode.trim(),
          country: address.country.trim() || "United States",
        },
        billingAddress: {
          fullName: `${customer.firstName.trim()} ${customer.lastName.trim()}`,
          phone: customer.phone.trim(),
          addressLine1: address.addressLine1.trim(),
          addressLine2: address.addressLine2?.trim() || undefined,
          city: address.city.trim(),
          state: address.state.trim(),
          postalCode: address.postalCode.trim(),
          country: address.country.trim() || "United States",
        },
        paymentMethod,
        couponCode: appliedCoupon?.coupon?.code,
        notes: notes.trim() || undefined,
        idempotencyKey,
      };

      const res = await checkoutService.createOrder(payload);

      if (res.success && res.data) {
        // Clear cart only after confirmed successful order creation
        clearCart();
        // Redirect to Order Confirmation
        router.push(`/order/success?orderNumber=${res.data.orderNumber}`);
      } else {
        setSubmitError(res.message || "Failed to secure your order. Please try again.");
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while placing your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty, render refined luxury recovery state
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <Container>
          <CheckoutEmptyState />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-black">
      <main className="py-6 sm:py-10">
        <Container size="wide">
          {/* Breadcrumb Navigation */}
          <nav className="text-xs font-sans text-stone-500 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
              <span>Home</span>
            </Link>
            <span className="text-[#C5A880]">&gt;</span>
            <Link href="/cart" className="hover:text-black transition-colors">
              <span>Shopping Bag</span>
            </Link>
            <span className="text-[#C5A880]">&gt;</span>
            <span className="text-black font-semibold">Checkout</span>
          </nav>

          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECE1] pb-6">
            <div>
              <Badge variant="accent" className="mb-2 bg-[#590B16]/10 text-[#590B16] border border-[#590B16]/20">
                <Icons.Lock className="w-3 h-3 mr-1.5 text-[#590B16]" />
                256-BIT ENCRYPTED LUXURY CHECKOUT
              </Badge>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight">
                Secure Checkout
              </h1>
              <p className="text-xs sm:text-sm text-black/80 font-sans mt-1">
                Finalize your bespoke fragrance acquisition with Maison concierge delivery
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-black/80 bg-white border border-[#E2DED6] px-4 py-2.5 rounded-xl shadow-2xs">
              <Icons.ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Authentic Product Guarantee</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative">
            {/* Left Column: Customer Details, Shipping, Payment */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              <CustomerInfoSection
                customer={customer}
                onChange={handleCustomerChange}
                errors={errors}
              />

              <ShippingAddressSection
                address={address}
                onChange={handleAddressChange}
                notes={notes}
                onNotesChange={setNotes}
                errors={errors}
              />

              <PaymentMethodSection
                paymentMethod={paymentMethod}
                onChange={setPaymentMethod}
                bankSettings={storeSettings?.payment?.bankTransfer}
                codEnabled={storeSettings?.payment?.cod?.enabled ?? true}
                bankEnabled={storeSettings?.payment?.bankTransfer?.enabled ?? true}
              />
            </div>

            {/* Right Column: Order Summary & Place Order CTA */}
            <aside className="lg:col-span-4 sticky top-20">
              <CheckoutOrderSummary
                items={cart.items}
                subtotal={cart.subtotal}
                freeShippingThreshold={storeSettings?.shipping?.freeShippingThreshold ?? 150}
                flatRateFee={storeSettings?.shipping?.flatRateFee ?? 15}
                taxRate={storeSettings?.tax?.defaultTaxPercentage ?? 5}
                enableTax={storeSettings?.tax?.enableTax ?? false}
                appliedCoupon={appliedCoupon}
                onApplyCoupon={setAppliedCoupon}
                isSubmitting={isSubmitting}
                onSubmitOrder={handleSubmitOrder}
                submitError={submitError}
                customerEmail={customer.email}
              />
            </aside>
          </div>
        </Container>
      </main>
    </div>
  );
}

