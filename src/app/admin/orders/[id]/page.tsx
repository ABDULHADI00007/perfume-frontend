"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { adminService } from "@/features/admin/services/adminService";
import { AdminOrder } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { useAdminNotification } from "@/features/admin/context/AdminNotificationContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminDetailSkeleton } from "@/components/admin/AdminDetailSkeleton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/ui/icons";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

// 1 Unified, Simple Status Dropdown
const UNIFIED_ORDER_STATUSES = [
  { label: "Pending (New Order)", value: "pending" },
  { label: "Confirmed (Verified / Packing)", value: "confirmed" },
  { label: "Delivered (Parcel Delivered)", value: "delivered" },
  { label: "Completed (Payment Received & Closed)", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const { hasPermission } = useAdminAuth();
  const { markAsRead } = useAdminNotification();

  useEffect(() => {
    if (orderId) {
      markAsRead(orderId);
    }
  }, [orderId, markAsRead]);

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Single Unified Status State
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Modals
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const loadOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getOrderById(orderId);
      setOrder(data);
      setSelectedStatus(data.orderStatus);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (hasPermission("orders.read")) {
      loadOrder();
    }
  }, [loadOrder, hasPermission]);

  if (!hasPermission("orders.read")) {
    return <AdminAccessDenied requiredPermission="orders.read" />;
  }

  if (isLoading) {
    return <AdminDetailSkeleton category="FULFILLMENT & DISPATCH" />;
  }

  if (!order) {
    return (
      <div className="bg-white border border-[#E6E2EA] p-8 text-center max-w-md mx-auto my-12 rounded-2xl shadow-xs space-y-4 font-sans">
        <p className="text-sm text-[#6B6F80]">Order not found.</p>
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate Accurate Financial Totals
  const rawTotal = (order as unknown as { total?: number }).total;
  const rawDiscount = (order as unknown as { discount?: number }).discount;
  const calculatedDiscount = typeof order.discountAmount === "number" ? order.discountAmount : rawDiscount ?? 0;
  const finalTotalAmount =
    typeof order.totalAmount === "number" && order.totalAmount > 0
      ? order.totalAmount
      : typeof rawTotal === "number" && rawTotal > 0
      ? rawTotal
      : Math.max(0, (order.subtotal || 0) - calculatedDiscount + (order.shippingFee || 0));

  const isOrderCompleted = order.orderStatus === "completed";

  // Resolved Customer Details
  const customerName =
    order.customerSnapshot?.name ||
    order.shippingAddress?.fullName ||
    (order.customer?.firstName
      ? `${order.customer.firstName} ${order.customer.lastName || ""}`.trim()
      : null) ||
    order.customer?.name ||
    "Customer";

  const customerEmail =
    order.customerSnapshot?.email ||
    order.customer?.email ||
    "";

  const customerPhone =
    order.customerSnapshot?.phone ||
    order.shippingAddress?.phone ||
    order.customer?.phone ||
    "";

  const customerInitials =
    customerName
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "C";

  // Single Unified Status Update
  const handleSaveOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;

    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage(null);

      let updated: AdminOrder;

      if (selectedStatus === "completed") {
        try {
          updated = await adminService.updateOrderStatus(orderId, "completed");
        } catch {
          updated = await adminService.updateOrderStatus(orderId, "delivered");
        }

        if (updated.paymentStatus !== "paid") {
          updated = await adminService.updatePaymentStatus(
            orderId,
            "paid",
            "Auto-marked as Paid upon order completion"
          );
        }

        setOrder(updated);
        setSelectedStatus("completed");
        setSuccessMessage(`Order #${order.orderNumber} marked as Completed & Payment marked as Paid!`);
      } else if (selectedStatus === "cancelled") {
        try {
          updated = await adminService.cancelOrder(orderId, "Cancelled by Admin");
        } catch {
          updated = await adminService.updateOrderStatus(orderId, "cancelled");
        }
        setOrder(updated);
        setSelectedStatus(updated.orderStatus);
        setSuccessMessage(`Order #${order.orderNumber} has been cancelled.`);
      } else {
        updated = await adminService.updateOrderStatus(orderId, selectedStatus);
        setOrder(updated);
        setSelectedStatus(updated.orderStatus);
        setSuccessMessage(`Order #${order.orderNumber} status updated to ${selectedStatus.toUpperCase()} successfully.`);
      }
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 4000);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update order status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprovePayment = async () => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage(null);
      setJustUpdated(false);
      const updated = await adminService.approvePayment(orderId);
      setOrder(updated);
      setSelectedStatus(updated.orderStatus);
      setSuccessMessage(`Payment proof for Order #${order.orderNumber} approved successfully!`);
      setJustUpdated(true);
      setIsProofModalOpen(false);
      setTimeout(() => setJustUpdated(false), 4000);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to approve payment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async () => {
    if (!rejectReason || rejectReason.trim().length < 3) {
      setError("Rejection reason must be at least 3 characters.");
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage(null);
      setJustUpdated(false);
      const updated = await adminService.rejectPayment(orderId, rejectReason.trim());
      setOrder(updated);
      setSuccessMessage(`Payment proof for Order #${order.orderNumber} rejected.`);
      setJustUpdated(true);
      setIsRejectModalOpen(false);
      setIsProofModalOpen(false);
      setRejectReason("");
      setTimeout(() => setJustUpdated(false), 4000);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reject payment");
    } finally {
      setActionLoading(false);
    }
  };

  const proofUrl = order.paymentProof?.url || order.paymentProof?.proofUrl;

  return (
    <div className="space-y-6 font-sans max-w-7xl relative">
      {/* Floating Viewport Toast for Immediate Visibility in empty space below header */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-20 right-4 sm:right-8 z-[99999] max-w-md bg-white border border-emerald-500/40 text-stone-900 shadow-[0_16px_40px_rgba(0,0,0,0.18)] rounded-2xl p-4 flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <Icons.Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 pr-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Order Updated Successfully
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                {successMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <Icons.Close size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminPageHeader
        category="STORE MANAGEMENT"
        title={`Order #${order.orderNumber}`}
        description={`Placed on ${formatDate(order.createdAt)} • Payment Method: ${order.paymentMethod?.replace(/_/g, " ").toUpperCase()}`}
        breadcrumbs={[
          { label: "Orders", href: "/admin/orders" },
          { label: `#${order.orderNumber}` },
        ]}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
            <StatusBadge status={order.orderStatus} />

            <Link href="/admin/orders" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto h-8.5 px-3.5 text-xs text-[#0C134F] hover:text-[#0C134F] border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-100 rounded-xl shadow-2xs transition-all gap-1.5 justify-center"
              >
                <Icons.ArrowLeft size={13} className="text-slate-400" />
                <span>Back to Orders</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Feedback Alerts */}
      {error && (
        <div className="p-3.5 px-4 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Icons.AlertCircle size={15} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-600 hover:text-rose-800 text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}
      {successMessage && (
        <div className="p-3.5 px-4 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Icons.Check size={15} className="shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bank Transfer Payment Proof Review Alert (if uploaded) */}
      {order.paymentMethod === "bank_transfer" && proofUrl && (
        <div className="border border-slate-200/80 bg-white rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#0C134F] flex items-center justify-center border border-[#EFECE6] shrink-0">
              <Icons.ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0C134F] uppercase tracking-wider">
                Bank Transfer Receipt Uploaded
              </p>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Customer submitted payment verification proof.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProofModalOpen(true)}
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0C134F] rounded-xl px-3.5 h-9 text-xs shadow-2xs gap-1.5 justify-center"
            >
              <Icons.Eye size={14} className="text-slate-400" />
              <span>Inspect Receipt</span>
            </Button>
            {hasPermission("orders.update") && order.paymentStatus !== "paid" && (
              <Button
                variant="tableActionSuccess"
                size="sm"
                onClick={handleApprovePayment}
                isLoading={actionLoading}
                className="w-full sm:w-auto h-9 px-3.5 text-xs rounded-xl shadow-2xs gap-1.5 font-bold justify-center"
              >
                <Icons.Check size={14} />
                <span>Approve & Verify</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Order Content 2-Column Balanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Wide 2 Cols): Ordered Fragrances & Financials */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-slate-200/80 bg-white rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#0C134F]">
                Ordered Fragrances
              </h3>
              <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-3 text-xs transition-colors hover:bg-slate-50/50 -mx-2 px-2 rounded-xl">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#EFECE6] flex items-center justify-center font-serif text-[#0C134F] shrink-0 shadow-2xs">
                      <Icons.Package size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#0C134F] text-[13px] truncate">
                        {typeof item.productId === "object" ? item.productId.name : item.name || "Fragrance"}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                        SKU: {item.sku} {item.size ? `• ${item.size}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-mono text-slate-500 text-[11px]">
                      {item.quantity} × {formatCurrency(item.unitPrice, "PKR")}
                    </p>
                    <p className="font-bold text-[#0C134F] font-mono mt-0.5 text-sm">
                      {formatCurrency(item.totalPrice, "PKR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals Summary */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono font-medium">{formatCurrency(order.subtotal, "PKR")}</span>
              </div>
              {calculatedDiscount > 0 ? (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({order.couponCode || "Promotion"})</span>
                  <span className="font-mono">-{formatCurrency(calculatedDiscount, "PKR")}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-slate-600">
                <span>Nationwide Shipping Fee</span>
                <span className="font-mono font-medium">
                  {order.shippingFee === 0 ? "FREE" : formatCurrency(order.shippingFee, "PKR")}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-sm font-bold text-[#0C134F] pt-3.5 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="font-mono text-xl font-bold text-[#0C134F]">
                  {formatCurrency(finalTotalAmount, "PKR")}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Note (if present) */}
          {order.notes && (
            <div className="border border-slate-200/80 bg-white rounded-2xl p-5 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <Icons.Edit size={13} />
                <span>Customer Order Note</span>
              </span>
              <p className="text-xs text-slate-600 italic bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EFECE6] leading-relaxed">
                &ldquo;{order.notes}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Right Column (Sidebar 1 Col): ORDER STATUS + CUSTOMER & SHIPPING */}
        <div className="space-y-6">
          {/* ORDER STATUS CARD */}
          {hasPermission("orders.update") && (
            <div className="border border-slate-200/80 bg-white rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#0C134F]">
                  Order Status
                </h3>
                <StatusBadge status={order.orderStatus} />
              </div>

              {/* If Order is Completed, no further changes allowed & button is replaced with "Order Completed" */}
              {isOrderCompleted ? (
                <div className="space-y-3.5 pt-1">
                  <div className="w-full py-3.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs">
                    <Icons.Check size={16} className="text-emerald-600" />
                    <span>Order Completed & Closed</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveOrderStatus} className="space-y-3.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Change Status
                    </label>
                    <Select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      options={UNIFIED_ORDER_STATUSES}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="brand"
                    size="sm"
                    className={cn(
                      "w-full text-white shadow-2xs text-xs font-bold uppercase tracking-wider h-10 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center gap-2",
                      justUpdated
                        ? "!bg-emerald-600 hover:!bg-emerald-700 shadow-emerald-600/25"
                        : "bg-[#0C134F] hover:bg-[#151D64]"
                    )}
                    isLoading={actionLoading}
                    disabled={actionLoading}
                  >
                    {justUpdated ? (
                      <>
                        <Icons.Check size={16} className="stroke-[2.5]" />
                        <span>Status Updated!</span>
                      </>
                    ) : (
                      <span>Update Status</span>
                    )}
                  </Button>
                </form>
              )}

              {/* Clean Payment Info Details */}
              <div className="pt-3 text-xs text-slate-600 space-y-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11.5px]">Payment Method</span>
                  <span className="font-semibold text-[#0C134F] uppercase tracking-wider text-[11px] font-mono">
                    {order.paymentMethod?.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11.5px]">Payment Status</span>
                  <StatusBadge status={order.paymentStatus} size="sm" />
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMER & DELIVERY DETAILS CARD */}
          <div className="border border-slate-200/80 bg-white rounded-2xl p-6 shadow-2xs space-y-5">
            {/* Customer Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#0C134F]">
                  Customer
                </h3>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0C134F]/5 text-[#0C134F] border border-[#0C134F]/10 flex items-center justify-center font-bold text-xs shrink-0 font-sans">
                  {customerInitials}
                </div>
                <div className="space-y-0.5 min-w-0 flex-1 text-xs">
                  <p className="font-semibold text-[#0C134F]">{customerName}</p>
                  {customerEmail && (
                    <a
                      href={`mailto:${customerEmail}`}
                      className="text-slate-500 hover:text-[#0C134F] font-mono text-[11px] block truncate transition-colors"
                      title={customerEmail}
                    >
                      {customerEmail}
                    </a>
                  )}
                  {customerPhone && (
                    <a
                      href={`tel:${customerPhone}`}
                      className="text-slate-500 hover:text-[#0C134F] font-mono text-[11px] block transition-colors"
                    >
                      {customerPhone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Destination */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#0C134F]">
                  Shipping Address
                </h3>
                <span className="text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                  {order.shippingAddress?.country || "Pakistan"}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
                <p className="font-semibold text-[#0C134F]">
                  {order.shippingAddress?.fullName || customerName}
                </p>
                <p>{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {[order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {order.shippingAddress?.phone && (
                  <p className="font-mono text-slate-500 pt-1 text-[11px]">
                    Phone: {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Proof Lightbox Modal */}
      {isProofModalOpen && proofUrl ? (
        <Modal
          isOpen={isProofModalOpen}
          onClose={() => setIsProofModalOpen(false)}
          title="Bank Transfer Payment Proof"
          description="Customer payment transfer receipt."
          maxWidth="lg"
        >
          <div className="space-y-4 pt-2 font-sans">
            <div className="max-h-[55vh] overflow-auto flex items-center justify-center bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proofUrl}
                alt="Uploaded Payment Receipt"
                className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-2xs"
              />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <a
                href={proofUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-500 hover:text-[#0C134F] underline font-medium"
              >
                Open image in new tab
              </a>
              <div className="flex gap-2">
                {hasPermission("orders.update") && order.paymentStatus !== "paid" && (
                  <>
                    <Button
                      variant="tableActionSuccess"
                      size="sm"
                      onClick={handleApprovePayment}
                      isLoading={actionLoading}
                      className="rounded-xl px-4 text-xs font-semibold shadow-2xs"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="tableActionDestructive"
                      size="sm"
                      onClick={() => setIsRejectModalOpen(true)}
                      className="rounded-xl px-4 text-xs font-semibold shadow-2xs"
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal>
      ) : null}

      {/* Payment Rejection Reason Modal */}
      {isRejectModalOpen ? (
        <Modal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          title="Reject Payment Receipt"
          description="Specify why this receipt is rejected."
          maxWidth="sm"
        >
          <div className="space-y-4 font-sans pt-2">
            <Input
              label="Rejection Reason *"
              placeholder="e.g. Transaction amount does not match order total"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRejectModalOpen(false)}
                disabled={actionLoading}
                className="border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#0C134F] rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="tableActionDestructive"
                size="sm"
                onClick={handleRejectPayment}
                isLoading={actionLoading}
                className="rounded-xl text-xs font-semibold"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
