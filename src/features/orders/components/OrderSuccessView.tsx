"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { orderService } from "@/features/orders/services/orderService";
import {
  OrderConfirmation,
  OrderStatus,
  PaymentStatus,
  StoreSettingsData,
} from "@/features/orders/types";
import { BankTransferDetails } from "./BankTransferDetails";
import { CodConfirmationNotice } from "./CodConfirmationNotice";
import { PaymentProofSection } from "./PaymentProofSection";

export function OrderSuccessView() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [storeSettings, setStoreSettings] = useState<StoreSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadConfirmationData() {
      if (!orderNumber) {
        setLoading(false);
        return;
      }

      try {
        const [orderRes, settingsRes] = await Promise.all([
          orderService.getOrderConfirmation(orderNumber),
          orderService.getStoreSettings().catch(() => null),
        ]);

        if (isMounted) {
          if (orderRes.success && orderRes.data) {
            setOrder(orderRes.data);
          } else {
            setError(orderRes.message || "Order details could not be retrieved.");
          }

          if (settingsRes?.success && settingsRes.data) {
            setStoreSettings(settingsRes.data);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to retrieve order details. Please verify your order reference."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadConfirmationData();

    return () => {
      isMounted = false;
    };
  }, [orderNumber]);

  const handleCopyOrderNumber = () => {
    if (!order?.orderNumber || !navigator.clipboard) return;
    navigator.clipboard.writeText(order.orderNumber);
    setCopiedOrderNumber(true);
    setTimeout(() => setCopiedOrderNumber(false), 2000);
  };

  const handleProofSubmitted = (updatedOrder: OrderConfirmation) => {
    setOrder(updatedOrder);
  };

  // Helper for Order Status Badge
  const getOrderStatusBadge = (status: OrderStatus): { label: string; variant: BadgeProps["variant"] } => {
    switch (status) {
      case "pending":
        return { label: "Order Placed", variant: "neutral" };
      case "awaiting_payment_verification":
        return { label: "Awaiting Wire Verification", variant: "warning" };
      case "confirmed":
        return { label: "Order Confirmed", variant: "success" };
      case "processing":
        return { label: "In Preparation", variant: "accent" };
      case "shipped":
        return { label: "Dispatched", variant: "dark" };
      case "delivered":
        return { label: "Delivered", variant: "success" };
      case "cancelled":
        return { label: "Cancelled", variant: "neutral" };
      case "refunded":
        return { label: "Refunded", variant: "neutral" };
      case "payment_rejected":
        return { label: "Payment Rejected", variant: "error" };
      default:
        return { label: status, variant: "default" };
    }
  };

  // Helper for Payment Status Badge
  const getPaymentStatusBadge = (
    payStatus: PaymentStatus,
    method: string
  ): { label: string; variant: BadgeProps["variant"] } => {
    if (method === "cash_on_delivery" && payStatus === "pending") {
      return { label: "Due on Delivery", variant: "neutral" };
    }
    switch (payStatus) {
      case "pending":
        return { label: "Payment Pending", variant: "neutral" };
      case "pending_verification":
        return { label: "Proof Under Review", variant: "warning" };
      case "paid":
        return { label: "Payment Settled", variant: "success" };
      case "rejected":
        return { label: "Payment Rejected", variant: "error" };
      case "failed":
        return { label: "Payment Failed", variant: "error" };
      case "refunded":
        return { label: "Refunded", variant: "neutral" };
      case "partially_refunded":
        return { label: "Partially Refunded", variant: "neutral" };
      default:
        return { label: payStatus, variant: "default" };
    }
  };

  // Loading State
  if (loading) {
    return (
      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
          <div className="border border-border p-6 sm:p-8 space-y-6 bg-surface">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-28" />
            </div>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </Container>
    );
  }

  // Error / Invalid Order Reference State
  if (error || !orderNumber || !order) {
    return (
      <Container className="py-16 sm:py-24 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-surface-subtle border border-border flex items-center justify-center mx-auto mb-6 text-foreground-subtle">
            <Icons.AlertCircle className="w-7 h-7 text-status-warning" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground uppercase tracking-widest mb-3">
            Order Confirmation
          </h1>
          <p className="text-sm text-foreground-muted font-sans mb-8 leading-relaxed">
            {error ||
              "No valid order reference was provided. If you recently completed an order, please check your email confirmation for your official reference number."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/perfumes">
              <Button className="w-full sm:w-auto px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans font-semibold">
                Explore Fragrances
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full sm:w-auto px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans font-semibold"
              >
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  const isBankTransfer = order.paymentMethod === "bank_transfer";
  const orderStatusBadge = getOrderStatusBadge(order.orderStatus);
  const paymentStatusBadge = getPaymentStatusBadge(order.paymentStatus, order.paymentMethod);
  const formattedTotal = formatCurrency(order.total);

  return (
    <div className="min-h-screen bg-surface py-10 sm:py-16 lg:py-20">
      <Container>
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header Banner */}
          <header className="text-center">
            <div className="w-14 h-14 rounded-full bg-accent-subtle/30 border border-accent/40 flex items-center justify-center mx-auto mb-4 text-primary">
              <Icons.Check className="w-7 h-7 text-primary" />
            </div>

            <span className="text-[11px] tracking-[0.24em] uppercase text-accent font-sans font-medium">
              Acquisition Secured
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl text-foreground uppercase tracking-[0.16em] mt-2 mb-3">
              Thank You for Your Order
            </h1>

            <p className="text-xs sm:text-sm text-foreground-muted font-sans max-w-lg mx-auto leading-relaxed">
              Your bespoke commission has been registered with Maison de Parfum. Confirmation has been prepared for{" "}
              <strong className="text-foreground font-semibold">{order.customerSnapshot?.email}</strong>.
            </p>
          </header>

          {/* Main Confirmation Card */}
          <div className="bg-surface border border-border divide-y divide-border/60 shadow-sm">
            {/* Order Reference & Status Badges */}
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-subtle/40">
              <div>
                <span className="block text-[10px] tracking-[0.18em] uppercase text-foreground-subtle mb-1 font-sans">
                  Order Reference
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg sm:text-xl font-semibold text-primary tracking-wider">
                    {order.orderNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyOrderNumber}
                    aria-label={`Copy order reference: ${order.orderNumber}`}
                    className="text-foreground-subtle hover:text-primary transition-colors p-1"
                  >
                    {copiedOrderNumber ? (
                      <span className="text-[10px] text-accent font-medium uppercase tracking-wider font-sans">
                        Copied
                      </span>
                    ) : (
                      <Icons.Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {order.createdAt && (
                  <span className="text-[11px] text-foreground-subtle font-sans block mt-0.5">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Badge variant={orderStatusBadge.variant} size="sm">
                  {orderStatusBadge.label}
                </Badge>
                <Badge variant={paymentStatusBadge.variant} size="sm">
                  {paymentStatusBadge.label}
                </Badge>
              </div>
            </div>

            {/* Payment Method Workflow Section */}
            {isBankTransfer ? (
              <div>
                <BankTransferDetails
                  settings={storeSettings?.payment?.bankTransfer}
                  orderNumber={order.orderNumber}
                  totalFormatted={formattedTotal}
                />
                <PaymentProofSection
                  order={order}
                  onProofSubmitted={handleProofSubmitted}
                />
              </div>
            ) : (
              <CodConfirmationNotice totalFormatted={formattedTotal} />
            )}

            {/* Purchased Items Snapshot */}
            <div className="p-6 sm:p-8">
              <h2 className="font-serif text-base uppercase tracking-widest text-foreground mb-4 font-medium">
                Fragrance Selection ({order.items?.length || 0})
              </h2>
              <div className="divide-y divide-border/60">
                {order.items?.map((item, idx) => (
                  <div key={item._id || item.sku || idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="w-14 h-16 bg-surface-subtle border border-border flex items-center justify-center p-1 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={56}
                          height={64}
                          className="object-contain max-h-full"
                        />
                      ) : (
                        <Icons.Bag className="w-5 h-5 text-foreground-subtle" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-sm sm:text-base text-foreground truncate font-medium">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-foreground-muted font-sans uppercase tracking-wider mt-0.5">
                        {item.size} • Qty: {item.quantity} • {formatCurrency(item.unitPrice)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-sm sm:text-base font-medium text-foreground">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer, Shipping, and Authoritative Financials */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans">
              {/* Left Column: Customer & Delivery Address */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-[11px] font-medium tracking-[0.14em] uppercase text-foreground/80 mb-2">
                    Delivery Destination
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    <strong className="font-semibold block">{order.shippingAddress?.fullName}</strong>
                    {order.shippingAddress?.addressLine1}
                    {order.shippingAddress?.addressLine2 && (
                      <>
                        <br />
                        {order.shippingAddress.addressLine2}
                      </>
                    )}
                    <br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                    {order.shippingAddress?.postalCode}
                    <br />
                    {order.shippingAddress?.country}
                  </p>
                </div>

                <div>
                  <h3 className="text-[11px] font-medium tracking-[0.14em] uppercase text-foreground/80 mb-1">
                    Contact Details
                  </h3>
                  <p className="text-foreground-muted leading-relaxed">
                    {order.customerSnapshot?.email}
                    {order.customerSnapshot?.phone && (
                      <>
                        <br />
                        {order.customerSnapshot.phone}
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Right Column: Authoritative Financial Breakdown */}
              <div>
                <h3 className="text-[11px] font-medium tracking-[0.14em] uppercase text-foreground/80 mb-2">
                  Settlement Breakdown
                </h3>
                <div className="space-y-2 text-foreground-muted bg-surface-subtle/40 p-4 border border-border">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-foreground font-medium">{formatCurrency(order.subtotal)}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Privilege Discount:</span>
                      <span className="font-medium">-{formatCurrency(order.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Courier Delivery:</span>
                    <span className="text-foreground font-medium">
                      {order.shippingFee === 0 ? "Complimentary" : formatCurrency(order.shippingFee)}
                    </span>
                  </div>

                  {order.tax > 0 && (
                    <div className="flex justify-between">
                      <span>Estimated Tax:</span>
                      <span className="text-foreground font-medium">{formatCurrency(order.tax)}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2.5 mt-1 border-t border-border/70 text-foreground font-serif text-sm sm:text-base font-semibold">
                    <span>Total {order.paymentStatus === "paid" ? "Paid" : "Due"}:</span>
                    <span className="text-primary">{formattedTotal}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Advisory */}
            <div className="p-6 sm:p-8 bg-surface-subtle/20 text-xs font-sans space-y-3">
              <h3 className="text-[11px] font-medium tracking-[0.14em] uppercase text-foreground/80">
                Next Steps for Your Order
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-foreground-muted">
                <div className="space-y-1">
                  <span className="font-serif text-primary text-sm font-semibold block">01. Confirmation</span>
                  <p className="text-[11px] leading-relaxed">
                    Your order details and dispatch reference are registered in our fulfillment system.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-serif text-primary text-sm font-semibold block">02. Preparation</span>
                  <p className="text-[11px] leading-relaxed">
                    {isBankTransfer
                      ? "Upon wire verification, your fragrance is carefully prepared with protective luxury packaging."
                      : "Our concierge prepares your bottles and schedules authorized courier pickup."}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-serif text-primary text-sm font-semibold block">03. Handover</span>
                  <p className="text-[11px] leading-relaxed">
                    {isBankTransfer
                      ? "Direct courier delivery with tracking updates provided to your email."
                      : `Parcel delivery with ${formattedTotal} collected in cash upon physical handover.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/perfumes">
              <Button className="w-full sm:w-auto px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans font-semibold">
                Continue Exploring
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full sm:w-auto px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans font-semibold"
              >
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
