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

  const handlePrintReceipt = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleProofSubmitted = (updatedOrder: OrderConfirmation) => {
    setOrder(updatedOrder);
  };

  // Helper for Order Status Badge
  const getOrderStatusBadge = (status: OrderStatus): { label: string; variant: BadgeProps["variant"] } => {
    switch (status) {
      case "pending":
        return { label: "Commission Registered", variant: "neutral" };
      case "awaiting_payment_verification":
        return { label: "Awaiting Wire Verification", variant: "warning" };
      case "confirmed":
        return { label: "Order Confirmed", variant: "success" };
      case "processing":
        return { label: "Artisanal Preparation", variant: "accent" };
      case "shipped":
        return { label: "Courier Dispatched", variant: "dark" };
      case "delivered":
        return { label: "Handover Complete", variant: "success" };
      case "cancelled":
        return { label: "Commission Cancelled", variant: "neutral" };
      case "refunded":
        return { label: "Refund Processed", variant: "neutral" };
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
      return { label: "Settlement Due Upon Handover", variant: "neutral" };
    }
    switch (payStatus) {
      case "pending":
        return { label: "Settlement Pending", variant: "neutral" };
      case "pending_verification":
        return { label: "Proof Under Review", variant: "warning" };
      case "paid":
        return { label: "Payment Confirmed", variant: "success" };
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
      <div className="min-h-screen bg-[#F8F6F0] py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-14 w-14 rounded-full mx-auto bg-[#0B1938]/10" />
            <Skeleton className="h-8 w-72 mx-auto bg-[#0B1938]/10" />
            <Skeleton className="h-4 w-96 mx-auto bg-[#0B1938]/10" />
            <div className="border border-[#0B1938]/10 p-8 space-y-6 bg-white rounded-xl shadow-sm">
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
      </div>
    );
  }

  // Error / Invalid Order Reference State
  if (error || !orderNumber || !order) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] py-16 sm:py-24">
        <Container>
          <div className="max-w-md mx-auto text-center bg-white p-8 sm:p-10 rounded-2xl border border-[#0B1938]/10 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-[#0B1938]/5 border border-[#0B1938]/15 flex items-center justify-center mx-auto mb-6 text-[#0B1938]">
              <Icons.AlertCircle className="w-8 h-8 text-[#B89742]" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#0B1938] uppercase tracking-wider mb-3 font-bold">
              Order Confirmation
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-sans mb-8 leading-relaxed">
              {error ||
                "No valid order reference was provided. If you recently completed an order, please verify your email confirmation."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/perfumes">
                <Button className="w-full sm:w-auto px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans font-semibold bg-[#0B1938] hover:bg-[#1E293B] text-white">
                  Explore Fragrances
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans font-semibold border-[#0B1938]/20 text-[#0B1938]"
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

  const isBankTransfer = order.paymentMethod === "bank_transfer";
  const orderStatusBadge = getOrderStatusBadge(order.orderStatus);
  const paymentStatusBadge = getPaymentStatusBadge(order.paymentStatus, order.paymentMethod);
  const formattedTotal = formatCurrency(order.total);

  return (
    <div className="min-h-screen bg-[#F8F6F0] py-8 sm:py-12 lg:py-16">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8 print:space-y-4">
          {/* Header Banner */}
          <header className="text-center print:text-left space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#0B1938] to-[#1E293B] text-[#D4AF37] flex items-center justify-center mx-auto shadow-xl border border-[#D4AF37]/30 ring-4 ring-[#D4AF37]/10 print:hidden">
              <Icons.Check className="w-8 h-8 text-[#D4AF37]" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#0B1938]/5 border border-[#D4AF37]/40 text-[#B89742] text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-sans font-semibold">
              <span>◆</span>
              <span>Acquisition Secured</span>
              <span>◆</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1938] uppercase tracking-tight">
              Thank You for Your Order
            </h1>

            <p className="text-xs sm:text-sm text-[#64748B] font-sans max-w-xl mx-auto leading-relaxed">
              Your bespoke fragrance commission has been registered with Maison de Parfum. Confirmation details have been prepared for{" "}
              <span className="inline-block bg-[#0B1938] text-white px-2.5 py-0.5 rounded-full text-xs font-mono font-medium shadow-sm">
                {order.customerSnapshot?.email}
              </span>
            </p>
          </header>

          {/* Luxury 4-Step Order Progress Tracker */}
          <div className="bg-white border border-[#0B1938]/10 p-6 sm:p-8 rounded-2xl shadow-sm print:hidden">
            <div className="text-center mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B89742] font-semibold font-sans">
                Order Fulfillment Journey
              </span>
              <h3 className="font-serif text-lg text-[#0B1938] font-bold uppercase tracking-wider">
                Status & Fulfillment Lifecycle
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="text-center space-y-2 relative">
                <div className="w-10 h-10 rounded-full bg-[#0B1938] text-[#D4AF37] flex items-center justify-center mx-auto shadow-md ring-2 ring-[#D4AF37]/30">
                  <Icons.Check className="w-5 h-5" />
                </div>
                <span className="block text-xs font-serif font-bold text-[#0B1938] uppercase tracking-wider">
                  01. Commission Placed
                </span>
                <span className="block text-[10px] text-[#64748B] font-sans">
                  Registered in System
                </span>
              </div>

              {/* Step 2 */}
              <div className="text-center space-y-2 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto shadow-md ${
                  isBankTransfer && order.paymentStatus !== "paid"
                    ? "bg-[#D4AF37]/20 border-2 border-[#D4AF37] text-[#B89742]"
                    : "bg-[#0B1938] text-[#D4AF37] ring-2 ring-[#D4AF37]/30"
                }`}>
                  <Icons.Tag className="w-4 h-4" />
                </div>
                <span className="block text-xs font-serif font-bold text-[#0B1938] uppercase tracking-wider">
                  02. Verification
                </span>
                <span className="block text-[10px] text-[#64748B] font-sans">
                  {isBankTransfer ? "Wire Verification" : "Order Confirmed"}
                </span>
              </div>

              {/* Step 3 */}
              <div className="text-center space-y-2 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto border ${
                  ["processing", "shipped", "delivered"].includes(order.orderStatus)
                    ? "bg-[#0B1938] text-[#D4AF37] ring-2 ring-[#D4AF37]/30"
                    : "bg-[#F8F6F0] text-[#94A3B8] border-[#0B1938]/10"
                }`}>
                  <Icons.Package className="w-4 h-4" />
                </div>
                <span className="block text-xs font-serif font-bold text-[#0B1938] uppercase tracking-wider">
                  03. Bottling & Packaging
                </span>
                <span className="block text-[10px] text-[#64748B] font-sans">
                  Artisanal Curing
                </span>
              </div>

              {/* Step 4 */}
              <div className="text-center space-y-2 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto border ${
                  order.orderStatus === "delivered"
                    ? "bg-[#0B1938] text-[#D4AF37] ring-2 ring-[#D4AF37]/30"
                    : "bg-[#F8F6F0] text-[#94A3B8] border-[#0B1938]/10"
                }`}>
                  <Icons.Truck className="w-4 h-4" />
                </div>
                <span className="block text-xs font-serif font-bold text-[#0B1938] uppercase tracking-wider">
                  04. White-Glove Delivery
                </span>
                <span className="block text-[10px] text-[#64748B] font-sans">
                  Courier Handover
                </span>
              </div>
            </div>
          </div>

          {/* Main Confirmation Card */}
          <div className="bg-white border border-[#0B1938]/15 rounded-2xl shadow-xl overflow-hidden divide-y divide-[#0B1938]/10">
            {/* Top Bar: Order Reference & Status Badges */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0B1938] via-[#1E293B] to-[#0B1938] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] font-sans font-semibold mb-1">
                  Official Order Reference
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-white tracking-widest">
                    {order.orderNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyOrderNumber}
                    aria-label={`Copy order reference: ${order.orderNumber}`}
                    className="text-[#D4AF37] hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded border border-[#D4AF37]/30 text-xs flex items-center gap-1.5 font-sans"
                  >
                    {copiedOrderNumber ? (
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                        Copied!
                      </span>
                    ) : (
                      <>
                        <Icons.Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                {order.createdAt && (
                  <span className="text-[11px] text-gray-300 font-sans block mt-1">
                    Commissioned on{" "}
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
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/30 text-xs font-sans font-semibold tracking-wider uppercase transition-colors print:hidden"
                >
                  <Icons.Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
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

            {/* Complimentary Luxury Perk Banner */}
            <div className="p-4 sm:p-5 bg-[#F8F6F0] border-y border-[#D4AF37]/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0B1938] text-[#D4AF37] flex items-center justify-center flex-shrink-0">
                <Icons.Gift className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-[#0B1938] font-sans leading-relaxed">
                <strong className="font-semibold">Complimentary Presentation:</strong> A complimentary 2ml discovery sample and signature luxury presentation box are included with your order.
              </p>
            </div>

            {/* Purchased Items Snapshot */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#0B1938]/10">
                <h2 className="font-serif text-lg uppercase tracking-wider text-[#0B1938] font-bold">
                  Fragrance Selection ({order.items?.length || 0})
                </h2>
                <span className="text-xs text-[#64748B] font-sans">
                  Bespoke Formulations
                </span>
              </div>

              <div className="divide-y divide-[#0B1938]/10">
                {order.items?.map((item, idx) => (
                  <div key={item._id || item.sku || idx} className="py-5 first:pt-0 last:pb-0 flex items-center gap-4 sm:gap-6">
                    <div className="w-16 h-20 bg-[#F8F6F0] border border-[#0B1938]/15 rounded-lg flex items-center justify-center p-2 flex-shrink-0 shadow-sm relative group overflow-hidden">
                      <OrderItemImage src={item.image} alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base sm:text-lg text-[#0B1938] font-bold truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#0B1938]/5 text-[10px] font-sans font-semibold uppercase text-[#0B1938] border border-[#0B1938]/10">
                          Size: {item.size}
                        </span>
                        <span className="text-xs text-[#64748B] font-sans">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-xs text-[#64748B] font-sans">
                          • {formatCurrency(item.unitPrice)} each
                        </span>
                      </div>
                      {item.sku && (
                        <span className="text-[10px] font-mono text-[#94A3B8] block mt-1">
                          SKU: {item.sku}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-base sm:text-lg font-bold text-[#0B1938]">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer, Shipping, and Authoritative Financials */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans bg-[#F8F6F0]/40">
              {/* Left Column: Customer & Delivery Address */}
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-[#0B1938]/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#0B1938]/10 text-[#0B1938]">
                    <Icons.Truck className="w-4 h-4 text-[#B89742]" />
                    <h3 className="text-xs font-serif font-bold tracking-[0.14em] uppercase">
                      Delivery Destination
                    </h3>
                  </div>
                  <p className="text-[#334155] leading-relaxed text-xs">
                    <strong className="font-semibold text-[#0B1938] block text-sm mb-1 font-serif">
                      {order.shippingAddress?.fullName}
                    </strong>
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
                    <span className="font-semibold text-[#0B1938]">{order.shippingAddress?.country}</span>
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#0B1938]/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#0B1938]/10 text-[#0B1938]">
                    <Icons.User className="w-4 h-4 text-[#B89742]" />
                    <h3 className="text-xs font-serif font-bold tracking-[0.14em] uppercase">
                      Client Contact Information
                    </h3>
                  </div>
                  <p className="text-[#334155] leading-relaxed text-xs">
                    <span className="block text-[#64748B]">Email:</span>
                    <strong className="text-[#0B1938] font-mono">{order.customerSnapshot?.email}</strong>
                    {order.customerSnapshot?.phone && (
                      <>
                        <br />
                        <span className="block text-[#64748B] mt-1">Phone:</span>
                        <strong className="text-[#0B1938]">{order.customerSnapshot.phone}</strong>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Right Column: Authoritative Financial Breakdown */}
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#0B1938]/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#0B1938]/10 text-[#0B1938]">
                    <Icons.Tag className="w-4 h-4 text-[#B89742]" />
                    <h3 className="text-xs font-serif font-bold tracking-[0.14em] uppercase">
                      Settlement Summary
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs text-[#475569]">
                    <div className="flex justify-between items-center">
                      <span>Subtotal:</span>
                      <span className="text-[#0B1938] font-semibold">{formatCurrency(order.subtotal)}</span>
                    </div>

                    {order.discount > 0 && (
                      <div className="flex justify-between items-center text-[#B89742]">
                        <span>Privilege Coupon Discount:</span>
                        <span className="font-semibold">-{formatCurrency(order.discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span>White-Glove Courier Delivery:</span>
                      <span className="text-[#0B1938] font-semibold">
                        {order.shippingFee === 0 ? (
                          <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Complimentary
                          </span>
                        ) : (
                          formatCurrency(order.shippingFee)
                        )}
                      </span>
                    </div>

                    {order.tax > 0 && (
                      <div className="flex justify-between items-center">
                        <span>Estimated Tax:</span>
                        <span className="text-[#0B1938] font-semibold">{formatCurrency(order.tax)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t-2 border-[#0B1938]/10 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#64748B] block font-sans">
                      Final Amount {order.paymentStatus === "paid" ? "Paid" : "Due"}
                    </span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-[#0B1938]">
                      {formattedTotal}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded bg-[#0B1938] text-[#D4AF37] font-mono font-bold text-xs uppercase tracking-wider">
                    {order.currency || "PKR"}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps & Client Support Advisory */}
            <div className="p-6 sm:p-8 bg-[#0B1938] text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                    Concierge Client Care
                  </span>
                  <h3 className="font-serif text-lg text-white font-bold uppercase tracking-wider">
                    Need Assistance with Your Order?
                  </h3>
                </div>
                <div className="text-xs font-sans text-gray-300">
                  <span>Support Line: </span>
                  <a href="mailto:concierge@maisonparfum.com" className="text-[#D4AF37] font-mono hover:underline font-bold">
                    concierge@maisonparfum.com
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-gray-300">
                <div className="space-y-1.5 p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="font-serif text-[#D4AF37] text-sm font-bold block">
                    01. Order Registration
                  </span>
                  <p className="text-[11px] leading-relaxed text-gray-400">
                    Your bespoke commission is officially registered in our master fulfillment registry.
                  </p>
                </div>

                <div className="space-y-1.5 p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="font-serif text-[#D4AF37] text-sm font-bold block">
                    02. Artisanal Curing
                  </span>
                  <p className="text-[11px] leading-relaxed text-gray-400">
                    {isBankTransfer
                      ? "Upon bank wire receipt verification, your flacons are hand-inspected and boxed."
                      : "Our perfumers prepare your flacons and schedule authorized white-glove courier pickup."}
                  </p>
                </div>

                <div className="space-y-1.5 p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="font-serif text-[#D4AF37] text-sm font-bold block">
                    03. White-Glove Handover
                  </span>
                  <p className="text-[11px] leading-relaxed text-gray-400">
                    {isBankTransfer
                      ? "Direct courier delivery with tracking updates dispatched to your email."
                      : `Parcel delivery with ${formattedTotal} collected upon physical handover.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 print:hidden">
            <Link href="/perfumes" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-8 py-4 text-xs tracking-[0.2em] uppercase font-sans font-bold bg-[#0B1938] hover:bg-[#1E293B] text-white shadow-md">
                Explore Fragrance Library
              </Button>
            </Link>
            <button
              type="button"
              onClick={handlePrintReceipt}
              className="w-full sm:w-auto px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans font-bold border-2 border-[#0B1938] text-[#0B1938] hover:bg-[#0B1938] hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2"
            >
              <Icons.Printer className="w-4 h-4" />
              <span>Print Official Receipt</span>
            </button>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto px-8 py-4 text-xs tracking-[0.2em] uppercase font-sans font-bold border-[#0B1938]/20 text-[#0B1938]"
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

function OrderItemImage({ src, alt }: { src?: string; alt: string }) {
  const defaultSrc = "/images/perfumes/oyd_royal.png";
  const initialSrc = src && (src.startsWith("/") || src.startsWith("http")) ? src : defaultSrc;
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);

  useEffect(() => {
    if (src && (src.startsWith("/") || src.startsWith("http"))) {
      setImgSrc(src);
    }
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={64}
      height={80}
      className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
      onError={() => {
        setImgSrc(defaultSrc);
      }}
    />
  );
}
