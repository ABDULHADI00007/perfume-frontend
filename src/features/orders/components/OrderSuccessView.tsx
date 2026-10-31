"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
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

  // Minimal Status Helpers
  const getOrderStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case "pending":
        return "Order Received";
      case "awaiting_payment_verification":
        return "Awaiting Verification";
      case "confirmed":
        return "Confirmed";
      case "processing":
        return "Preparing";
      case "shipped":
        return "Dispatched";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      case "refunded":
        return "Refunded";
      default:
        return status;
    }
  };

  const getPaymentStatusLabel = (payStatus: PaymentStatus, method: string): string => {
    if (method === "cash_on_delivery" && payStatus === "pending") {
      return "Cash on Delivery";
    }
    switch (payStatus) {
      case "pending":
        return "Pending";
      case "pending_verification":
        return "Proof Under Review";
      case "paid":
        return "Paid";
      case "rejected":
        return "Payment Rejected";
      default:
        return payStatus;
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-14 w-14 rounded-full mx-auto bg-stone-200" />
            <Skeleton className="h-8 w-72 mx-auto bg-stone-200" />
            <Skeleton className="h-4 w-96 mx-auto bg-stone-200" />
            <div className="border border-stone-200 p-8 space-y-6 bg-white rounded-2xl shadow-xs">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Error State
  if (error || !orderNumber || !order) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-16 sm:py-24">
        <Container>
          <div className="max-w-md mx-auto text-center bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#590B16]/10 text-[#590B16] flex items-center justify-center mx-auto mb-5">
              <Icons.AlertCircle className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 tracking-tight mb-2 font-normal">
              Order Confirmation
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-sans mb-8 leading-relaxed">
              {error || "No valid order reference was found. Please check your confirmation email."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/perfumes" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-7 py-3 text-xs tracking-wider uppercase font-sans font-semibold bg-[#590B16] hover:bg-[#720E1D] text-white rounded-full">
                  Explore Fragrances
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-7 py-3 text-xs tracking-wider uppercase font-sans font-semibold border-stone-300 text-stone-700 hover:bg-stone-50 rounded-full"
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
  const formattedTotal = formatCurrency(order.total);

  // Stepper logic
  const steps = [
    { id: 1, label: "Order Placed", isDone: true, isCurrent: order.orderStatus === "pending" },
    {
      id: 2,
      label: "Confirmed",
      isDone: ["confirmed", "processing", "shipped", "delivered"].includes(order.orderStatus),
      isCurrent: order.orderStatus === "confirmed",
    },
    {
      id: 3,
      label: "Dispatched",
      isDone: ["shipped", "delivered"].includes(order.orderStatus),
      isCurrent: order.orderStatus === "shipped",
    },
    {
      id: 4,
      label: "Delivered",
      isDone: order.orderStatus === "delivered",
      isCurrent: order.orderStatus === "delivered",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 sm:py-16">
      <Container>
        <div className="max-w-3xl mx-auto space-y-8 print:space-y-4">

          {/* Minimalist Hero Header */}
          <header className="text-center space-y-3.5 print:text-left">
            <div className="w-14 h-14 rounded-full bg-[#590B16] text-[#FAF8F5] flex items-center justify-center mx-auto shadow-md ring-4 ring-[#C5A880]/30 print:hidden">
              <Icons.Check className="w-7 h-7" />
            </div>

            <span className="inline-block text-[11px] uppercase tracking-[0.22em] text-[#590B16] font-sans font-semibold">
              Order Confirmed
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight">
              Thank You For Your Order
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-lg mx-auto leading-relaxed">
              We have received your order with <strong className="text-stone-900 font-medium">Soulmate Scents</strong>. A confirmation email has been sent to{" "}
              <span className="font-medium text-stone-900 underline underline-offset-2">
                {order.customerSnapshot?.email}
              </span>.
            </p>
          </header>

          {/* Clean 4-Step Fulfillment Stepper */}
          <div className="bg-white border border-stone-200/80 p-5 sm:p-7 rounded-2xl shadow-xs print:hidden">
            <div className="flex items-center justify-between relative">
              {/* Connecting Progress Line */}
              <div className="absolute top-4 sm:top-5 left-6 right-6 h-[2px] bg-stone-200 z-0" />
              <div
                className="absolute top-4 sm:top-5 left-6 h-[2px] bg-[#590B16] z-0 transition-all duration-500"
                style={{
                  width:
                    order.orderStatus === "delivered"
                      ? "calc(100% - 3rem)"
                      : order.orderStatus === "shipped"
                      ? "calc(66% - 2rem)"
                      : ["confirmed", "processing"].includes(order.orderStatus)
                      ? "calc(33% - 1rem)"
                      : "0%",
                }}
              />

              {steps.map((step) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-sans text-xs font-semibold transition-all ${
                      step.isDone
                        ? "bg-[#590B16] text-white shadow-xs"
                        : "bg-white border-2 border-stone-300 text-stone-400"
                    }`}
                  >
                    {step.isDone ? <Icons.Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.id}
                  </div>
                  <span
                    className={`mt-2 text-[11px] sm:text-xs font-sans tracking-wide ${
                      step.isDone || step.isCurrent ? "font-semibold text-stone-900" : "text-stone-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Order Card */}
          <div className="bg-white border border-stone-200/80 rounded-2xl shadow-xs overflow-hidden">
            
            {/* Top Bar: Order Reference & Status */}
            <div className="p-5 sm:p-6 bg-[#FAF7EE] border-b border-[#C5A880]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block mb-1">
                  Order Number
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-lg sm:text-xl font-bold text-stone-900 tracking-wider">
                    {order.orderNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyOrderNumber}
                    aria-label={`Copy order number: ${order.orderNumber}`}
                    className="text-stone-500 hover:text-[#590B16] bg-white border border-stone-200 hover:border-[#590B16]/30 px-2.5 py-1 rounded-md text-[11px] font-sans font-medium transition-colors flex items-center gap-1.5"
                  >
                    {copiedOrderNumber ? (
                      <span className="text-[#590B16] font-semibold">Copied!</span>
                    ) : (
                      <>
                        <Icons.Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                {order.createdAt && (
                  <span className="text-xs text-stone-500 font-sans block mt-1">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-sans font-medium bg-[#590B16]/10 text-[#590B16] border border-[#590B16]/20">
                  {getOrderStatusLabel(order.orderStatus)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-sans font-medium bg-[#C5A880]/15 text-[#8C6D37] border border-[#C5A880]/30">
                  {getPaymentStatusLabel(order.paymentStatus, order.paymentMethod)}
                </span>
              </div>
            </div>

            {/* Payment Method Details (COD or Bank Transfer) */}
            <div className="p-5 sm:p-6 border-b border-stone-100">
              {isBankTransfer ? (
                <div className="space-y-4">
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
            </div>

            {/* Purchased Items List */}
            <div className="p-5 sm:p-6 border-b border-stone-100">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-stone-900 mb-4">
                Items in Your Order ({order.items?.length || 0})
              </h2>

              <div className="divide-y divide-stone-100">
                {order.items?.map((item, idx) => (
                  <div
                    key={item._id || item.sku || idx}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-14 h-16 bg-[#FAF8F5] border border-stone-200 rounded-lg flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                        <OrderItemImage src={item.image} alt={item.name} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif text-sm sm:text-base font-medium text-stone-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-stone-500 font-sans mt-0.5">
                          {item.size} &nbsp;|&nbsp; Qty: {item.quantity} &nbsp;•&nbsp; {formatCurrency(item.unitPrice)} each
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif text-sm sm:text-base font-semibold text-stone-900">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address & Financial Breakdown */}
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF8F5]/50">
              
              {/* Shipping Destination */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-serif font-semibold text-sm">
                  <Icons.Truck className="w-4 h-4 text-[#590B16]" />
                  <span>Delivery Address</span>
                </div>
                <div className="text-xs text-stone-600 font-sans leading-relaxed pl-6">
                  <p className="font-medium text-stone-900">{order.shippingAddress?.fullName}</p>
                  <p>{order.shippingAddress?.addressLine1}</p>
                  {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                  </p>
                  <p className="font-medium text-stone-800">{order.shippingAddress?.country}</p>
                  {order.customerSnapshot?.phone && (
                    <p className="pt-1 text-stone-500 font-mono">Ph: {order.customerSnapshot.phone}</p>
                  )}
                </div>
              </div>

              {/* Order Cost Breakdown */}
              <div className="space-y-2.5 text-xs font-sans text-stone-600">
                <div className="flex items-center gap-2 text-stone-900 font-serif font-semibold text-sm mb-2">
                  <Icons.Tag className="w-4 h-4 text-[#590B16]" />
                  <span>Payment Summary</span>
                </div>

                <div className="space-y-2 pl-6">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="font-medium text-stone-900">{formatCurrency(order.subtotal)}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between items-center text-[#590B16]">
                      <span>Discount</span>
                      <span className="font-medium">-{formatCurrency(order.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Delivery</span>
                    <span className="font-medium text-stone-900">
                      {order.shippingFee === 0 ? (
                        <span className="text-emerald-700 font-semibold">Free</span>
                      ) : (
                        formatCurrency(order.shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="pt-2 mt-2 border-t border-stone-200 flex justify-between items-baseline">
                    <span className="font-serif font-semibold text-sm text-stone-900">Total</span>
                    <span className="font-serif text-xl font-bold text-[#590B16]">
                      {formattedTotal}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Minimalist Concierge Care Note */}
          <div className="p-4 sm:p-5 bg-white border border-stone-200/80 rounded-xl flex items-center justify-between gap-4 text-xs font-sans text-stone-600">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#590B16]/10 text-[#590B16] flex items-center justify-center shrink-0">
                <Icons.Mail className="w-4 h-4" />
              </div>
              <p>
                Have a question about your fragrance delivery? Our concierge is here to help at{" "}
                <a
                  href="mailto:concierge@soulmatescents.com"
                  className="font-medium text-[#590B16] hover:underline"
                >
                  concierge@soulmatescents.com
                </a>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 print:hidden">
            <Link href="/perfumes" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-8 py-3.5 text-xs tracking-wider uppercase font-sans font-semibold bg-[#590B16] hover:bg-[#720E1D] text-white rounded-full shadow-xs">
                Continue Shopping
              </Button>
            </Link>

            <button
              type="button"
              onClick={handlePrintReceipt}
              className="w-full sm:w-auto px-6 py-3.5 text-xs tracking-wider uppercase font-sans font-semibold border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <Icons.Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>

            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto px-6 py-3.5 text-xs tracking-wider uppercase font-sans font-semibold border-stone-200 text-stone-600 hover:bg-stone-50 rounded-full"
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
      width={56}
      height={64}
      className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
      onError={() => {
        setImgSrc(defaultSrc);
      }}
    />
  );
}
