"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminOrder } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Icons } from "@/components/ui/icons";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const { hasPermission } = useAdminAuth();

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Status Update State
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [statusNotes, setStatusNotes] = useState<string>("");

  // Shipping Update State
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  // Payment Proof Modal & Rejection
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Cancel Order Modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const loadOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getOrderById(orderId);
      setOrder(data);
      setSelectedStatus(data.orderStatus);
      if (data.shippingInfo) {
        setCarrier(data.shippingInfo.carrier || "");
        setTrackingNumber(data.shippingInfo.trackingNumber || "");
        setTrackingUrl(data.shippingInfo.trackingUrl || "");
      }
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
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
        <Spinner size="lg" className="text-[#0C134F]" />
        <p className="text-xs text-[#6B6F80] uppercase tracking-[0.2em] font-medium font-sans">
          Loading Order Details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white border border-[#E6E2EA] p-8 text-center max-w-md mx-auto my-12 rounded-2xl shadow-xs space-y-4">
        <p className="text-sm text-[#6B6F80]">Order not found.</p>
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;

    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage(null);
      const updated = await adminService.updateOrderStatus(orderId, selectedStatus, statusNotes);
      setOrder(updated);
      setSuccessMessage("Order status updated successfully.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update order status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage(null);
      const updated = await adminService.updateShippingInfo(orderId, {
        carrier: carrier.trim() || undefined,
        trackingNumber: trackingNumber.trim() || undefined,
        trackingUrl: trackingUrl.trim() || undefined,
      });
      setOrder(updated);
      setSuccessMessage("Shipping tracking information saved successfully.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update shipping info");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprovePayment = async () => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage(null);
      const updated = await adminService.approvePayment(orderId);
      setOrder(updated);
      setSuccessMessage("Payment proof approved! Order verified.");
      setIsProofModalOpen(false);
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
      const updated = await adminService.rejectPayment(orderId, rejectReason.trim());
      setOrder(updated);
      setSuccessMessage("Payment proof rejected with reason recorded.");
      setIsRejectModalOpen(false);
      setIsProofModalOpen(false);
      setRejectReason("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reject payment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage(null);
      const updated = await adminService.cancelOrder(orderId, cancelReason.trim() || undefined);
      setOrder(updated);
      setSuccessMessage("Order has been cancelled.");
      setIsCancelModalOpen(false);
      setCancelReason("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const proofUrl = order.paymentProof?.url || order.paymentProof?.proofUrl;

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="FULFILLMENT & DISPATCH"
        title={`Order #${order.orderNumber}`}
        description={`Placed on ${formatDate(order.createdAt)} • Payment Method: ${order.paymentMethod?.replace(/_/g, " ").toUpperCase()}`}
        breadcrumbs={[
          { label: "Orders", href: "/admin/orders" },
          { label: `#${order.orderNumber}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={order.orderStatus} />
            <StatusBadge status={order.paymentStatus} />
            {hasPermission("orders.cancel") && order.orderStatus !== "cancelled" && (
              <Button
                variant="tableActionDestructive"
                size="sm"
                onClick={() => setIsCancelModalOpen(true)}
                disabled={actionLoading}
                className="h-8.5 px-3.5 text-xs rounded-xl shadow-2xs gap-1.5"
              >
                <Icons.Trash size={13} />
                <span>Cancel Order</span>
              </Button>
            )}
            <Link href="/admin/orders">
              <Button
                variant="outline"
                size="sm"
                className="h-8.5 px-3.5 text-xs text-[#0C134F] hover:text-[#0C134F] border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-100 rounded-xl shadow-2xs transition-all gap-1.5"
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
        <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5 shadow-2xs">
          <Icons.AlertCircle size={16} className="shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5 shadow-2xs">
          <Icons.Check size={16} className="shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Payment Proof Banner / Review Card if Bank Transfer */}
      {order.paymentMethod === "bank_transfer" && (
        <div className="border border-slate-200/80 bg-white rounded-2xl p-6 space-y-4 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-[#0C134F]/5 text-[#0C134F] flex items-center justify-center border border-[#0C134F]/15">
                <Icons.ShieldCheck size={16} />
              </div>
              <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#0C134F]">
                Bank Transfer Payment Proof
              </h3>
            </div>
            <StatusBadge status={order.paymentStatus} />
          </div>

          {proofUrl ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4.5 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-[#0C134F]">
                  Proof File: {order.paymentProof?.originalName || "Payment Receipt"}
                </p>
                {order.paymentProof?.submittedAt && (
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    Submitted: {formatDate(order.paymentProof.submittedAt)}
                  </p>
                )}
                {order.paymentProof?.rejectionReason && (
                  <p className="text-xs text-rose-600 mt-1.5 font-medium">
                    Rejection Reason: {order.paymentProof.rejectionReason}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProofModalOpen(true)}
                  className="bg-white hover:bg-slate-100 text-[#0C134F] hover:text-[#0C134F] border-slate-200 hover:border-slate-300 rounded-xl px-3 h-8.5 text-xs shadow-2xs gap-1.5"
                >
                  <Icons.ExternalLink size={13} className="text-slate-400" />
                  <span>View Receipt</span>
                </Button>

                {hasPermission("orders.update") && order.paymentStatus !== "paid" && (
                  <>
                    <Button
                      variant="tableActionSuccess"
                      size="sm"
                      onClick={handleApprovePayment}
                      isLoading={actionLoading}
                      className="h-8.5 px-3 text-xs rounded-xl shadow-2xs gap-1.5"
                    >
                      <Icons.Check size={13} />
                      <span>Approve</span>
                    </Button>
                    <Button
                      variant="tableActionDestructive"
                      size="sm"
                      onClick={() => setIsRejectModalOpen(true)}
                      disabled={actionLoading}
                      className="h-8.5 px-3 text-xs rounded-xl shadow-2xs gap-1.5"
                    >
                      <Icons.Trash size={13} />
                      <span>Reject</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              No payment receipt has been submitted by the customer yet.
            </p>
          )}
        </div>
      )}

      {/* Main Order Content 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Items & Financials */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table Card */}
          <div className="border border-slate-200/80 bg-white rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#0C134F]">
                Ordered Fragrances
              </h3>
              <Badge variant="secondary" size="sm" className="font-mono text-[10px] bg-slate-100/80 text-slate-600 border border-slate-200">
                {order.items?.length || 0} items
              </Badge>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between text-xs transition-colors hover:bg-slate-50/50 -mx-2 px-2 rounded-xl">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#0C134F]/5 border border-[#0C134F]/15 flex items-center justify-center font-serif text-[#0C134F] shrink-0 shadow-2xs">
                      <Icons.Package size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0C134F] text-[13px]">
                        {typeof item.productId === "object" ? item.productId.name : item.name || "Fragrance"}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        SKU: {item.sku} {item.size ? `• ${item.size}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-slate-500 text-[11px]">
                      {item.quantity} × {formatCurrency(item.unitPrice, order.currency || "USD")}
                    </p>
                    <p className="font-bold text-[#0C134F] font-mono mt-0.5 text-sm">
                      {formatCurrency(item.totalPrice, order.currency || "USD")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals Summary */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(order.subtotal, order.currency || "USD")}</span>
              </div>
              {order.discountAmount ? (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({order.couponCode || "Coupon"})</span>
                  <span className="font-mono">-{formatCurrency(order.discountAmount, order.currency || "USD")}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-mono">{formatCurrency(order.shippingFee, order.currency || "USD")}</span>
              </div>
              {order.taxAmount ? (
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax</span>
                  <span className="font-mono">{formatCurrency(order.taxAmount, order.currency || "USD")}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-sm font-bold text-[#0C134F] pt-3.5 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="font-mono text-lg font-bold text-[#0C134F]">{formatCurrency(order.totalAmount, order.currency || "USD")}</span>
              </div>
            </div>
          </div>

          {/* Operational Controls: Status & Shipping */}
          {hasPermission("orders.update") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Order Lifecycle Updater Card */}
              <div className="border border-slate-200/80 bg-white rounded-2xl p-6 shadow-2xs flex flex-col justify-between h-full">
                <form onSubmit={handleUpdateStatus} className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#0C134F] border-b border-slate-100 pb-3 mb-4">
                      Update Order Lifecycle
                    </h3>
                    <div className="space-y-4">
                      <Select
                        label="Status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        options={[
                          { label: "Pending", value: "pending" },
                          { label: "Awaiting Payment Verification", value: "awaiting_payment_verification" },
                          { label: "Confirmed", value: "confirmed" },
                          { label: "Processing", value: "processing" },
                          { label: "Shipped", value: "shipped" },
                          { label: "Delivered", value: "delivered" },
                          { label: "Cancelled", value: "cancelled" },
                          { label: "Refunded", value: "refunded" },
                          { label: "Payment Rejected", value: "payment_rejected" },
                        ]}
                      />
                      <Input
                        label="Internal Notes"
                        placeholder="Optional transition notes..."
                        value={statusNotes}
                        onChange={(e) => setStatusNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-4 mt-6">
                    <Button
                      type="submit"
                      variant="brand"
                      size="sm"
                      className="w-full shadow-xs text-xs font-bold uppercase tracking-wider h-10 rounded-xl"
                      isLoading={actionLoading}
                    >
                      Save Status
                    </Button>
                  </div>
                </form>
              </div>

              {/* Shipping & Tracking Updater Card */}
              <div className="border border-slate-200/80 bg-white rounded-2xl p-6 shadow-2xs flex flex-col justify-between h-full">
                <form onSubmit={handleUpdateShipping} className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#0C134F] border-b border-slate-100 pb-3 mb-4">
                      Shipping & Tracking
                    </h3>
                    <div className="space-y-3">
                      <Input
                        label="Carrier"
                        placeholder="e.g. DHL, FedEx, UPS"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                      />
                      <Input
                        label="Tracking Number"
                        placeholder="Tracking Code"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                      />
                      <Input
                        label="Tracking URL"
                        placeholder="https://track.carrier.com/..."
                        value={trackingUrl}
                        onChange={(e) => setTrackingUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-4 mt-6">
                    <Button
                      type="submit"
                      variant="brand"
                      size="sm"
                      className="w-full shadow-xs text-xs font-bold uppercase tracking-wider h-10 rounded-xl"
                      isLoading={actionLoading}
                    >
                      Save Tracking
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Customer & Delivery Addresses */}
        <div className="space-y-6">
          {/* Customer Profile Card */}
          <div className="border border-slate-200/80 bg-white rounded-2xl p-6 space-y-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Icons.User size={16} className="text-[#0C134F]" />
              <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#0C134F]">
                Customer Details
              </h3>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-[#0C134F] text-sm">{order.customer?.name}</p>
              <p className="text-slate-500">{order.customer?.email}</p>
              {order.customer?.phone && (
                <p className="text-slate-500 font-mono mt-1">{order.customer?.phone}</p>
              )}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="border border-slate-200/80 bg-white rounded-2xl p-6 space-y-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Icons.Delivery size={16} className="text-[#0C134F]" />
              <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#0C134F]">
                Shipping Destination
              </h3>
            </div>
            <div className="leading-relaxed text-slate-600 space-y-0.5">
              <p className="font-semibold text-[#0C134F]">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress?.addressLine2}</p>}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p className="mt-1 font-mono text-[11px] text-slate-500">{order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Notes Card */}
          {order.notes && (
            <div className="border border-slate-200/80 bg-white rounded-2xl p-6 space-y-2 text-xs shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Icons.Edit size={16} className="text-[#0C134F]" />
                <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#0C134F]">
                  Order Notes
                </h3>
              </div>
              <p className="text-slate-600 italic leading-relaxed">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Proof Lightbox Modal */}
      {isProofModalOpen && proofUrl && (
        <Modal
          isOpen={isProofModalOpen}
          onClose={() => setIsProofModalOpen(false)}
          title="Bank Transfer Payment Proof"
          description="Uploaded receipt submitted by the customer."
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
      )}

      {/* Payment Rejection Reason Modal */}
      {isRejectModalOpen && (
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
      )}

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title="Cancel Order"
          description={`Are you sure you want to cancel order ${order.orderNumber}?`}
          maxWidth="sm"
        >
          <div className="space-y-4 font-sans pt-2">
            <Input
              label="Cancellation Reason (optional)"
              placeholder="e.g. Customer requested cancellation"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={actionLoading}
                className="border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#0C134F] rounded-xl text-xs"
              >
                Keep Order
              </Button>
              <Button
                variant="tableActionDestructive"
                size="sm"
                onClick={handleCancelOrder}
                isLoading={actionLoading}
                className="rounded-xl text-xs font-semibold"
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
