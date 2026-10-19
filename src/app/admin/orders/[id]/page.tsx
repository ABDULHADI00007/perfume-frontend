"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminOrder } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
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
      {/* Breadcrumb & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E2EA] pb-4">
        <div className="flex items-center space-x-2 text-xs text-[#6B6F80]">
          <Link href="/admin/orders" className="hover:text-[#0C134F] transition-colors font-medium">
            Orders
          </Link>
          <span>/</span>
          <span className="text-[#121735] font-semibold font-mono">{order.orderNumber}</span>
        </div>

        <Link href="/admin/orders">
          <Button variant="outline" size="sm" className="text-xs text-[#6B6F80] hover:text-[#0C134F] border-[#E6E2EA]">
            <span>← Back to Orders</span>
          </Button>
        </Link>
      </div>

      {/* Main Order Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E6E2EA] shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center flex-wrap gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#0C134F] font-normal">
              Order <span className="font-mono text-xl">{order.orderNumber}</span>
            </h1>
            <StatusBadge status={order.orderStatus} />
            <StatusBadge status={order.paymentStatus} />
          </div>
          <p className="text-xs text-[#6B6F80] flex items-center gap-1.5 flex-wrap">
            <span>Placed on {formatDate(order.createdAt)}</span>
            <span>•</span>
            <span>Payment Method:</span>
            <Badge variant="secondary" size="sm" className="font-mono text-[9px] uppercase">
              {order.paymentMethod?.replace(/_/g, " ")}
            </Badge>
          </p>
        </div>

        {hasPermission("orders.cancel") && order.orderStatus !== "cancelled" && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsCancelModalOpen(true)}
            disabled={actionLoading}
            className="shadow-xs"
          >
            Cancel Order
          </Button>
        )}
      </div>

      {/* Feedback Alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <Icons.AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <Icons.Check size={16} className="shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Payment Proof Banner / Review Card if Bank Transfer */}
      {order.paymentMethod === "bank_transfer" && (
        <div className="border border-[#E6E2EA] bg-white rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E6E2EA] pb-3">
            <div className="flex items-center gap-2">
              <Icons.ShieldCheck size={18} className="text-[#0C134F]" />
              <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#121735]">
                Bank Transfer Payment Proof
              </h3>
            </div>
            <StatusBadge status={order.paymentStatus} />
          </div>

          {proofUrl ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FBF9F5] p-4 rounded-xl border border-[#E6E2EA]">
              <div>
                <p className="text-xs font-medium text-[#121735]">
                  Proof File: {order.paymentProof?.originalName || "Payment Receipt"}
                </p>
                {order.paymentProof?.submittedAt && (
                  <p className="text-[11px] text-[#6B6F80] mt-0.5 font-mono">
                    Submitted: {formatDate(order.paymentProof.submittedAt)}
                  </p>
                )}
                {order.paymentProof?.rejectionReason && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    Rejection Reason: {order.paymentProof.rejectionReason}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProofModalOpen(true)}
                  className="bg-white border-[#E6E2EA]"
                >
                  <Icons.ExternalLink size={14} className="mr-1.5" />
                  <span>View Receipt</span>
                </Button>

                {hasPermission("orders.update") && order.paymentStatus !== "paid" && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleApprovePayment}
                      isLoading={actionLoading}
                    >
                      Approve Payment
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setIsRejectModalOpen(true)}
                      disabled={actionLoading}
                    >
                      Reject Proof
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#6B6F80] italic">
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
          <div className="border border-[#E6E2EA] bg-white rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E2EA] pb-3">
              <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#6B6F80]">
                Ordered Fragrances
              </h3>
              <Badge variant="secondary" size="sm" className="font-mono text-[10px]">
                {order.items?.length || 0} items
              </Badge>
            </div>

            <div className="divide-y divide-[#E6E2EA]">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#FBF9F5] border border-[#E6E2EA] flex items-center justify-center font-serif text-[#6B6F80] shrink-0 shadow-2xs">
                      <Icons.Package size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#121735]">
                        {typeof item.productId === "object" ? item.productId.name : item.name || "Fragrance"}
                      </p>
                      <p className="text-[11px] text-[#6B6F80] font-mono mt-0.5">
                        SKU: {item.sku} {item.size ? `• ${item.size}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-[#6B6F80] text-[11px]">
                      {item.quantity} × {formatCurrency(item.unitPrice, order.currency || "USD")}
                    </p>
                    <p className="font-semibold text-[#0C134F] font-mono mt-0.5">
                      {formatCurrency(item.totalPrice, order.currency || "USD")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals Summary */}
            <div className="pt-4 border-t border-[#E6E2EA] space-y-2 text-xs">
              <div className="flex justify-between text-[#6B6F80]">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(order.subtotal, order.currency || "USD")}</span>
              </div>
              {order.discountAmount ? (
                <div className="flex justify-between text-[#2B5A41] font-medium">
                  <span>Discount ({order.couponCode || "Coupon"})</span>
                  <span className="font-mono">-{formatCurrency(order.discountAmount, order.currency || "USD")}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-[#6B6F80]">
                <span>Shipping Fee</span>
                <span className="font-mono">{formatCurrency(order.shippingFee, order.currency || "USD")}</span>
              </div>
              {order.taxAmount ? (
                <div className="flex justify-between text-[#6B6F80]">
                  <span>Estimated Tax</span>
                  <span className="font-mono">{formatCurrency(order.taxAmount, order.currency || "USD")}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-sm font-semibold text-[#0C134F] pt-3 border-t border-[#E6E2EA]">
                <span>Total Amount</span>
                <span className="font-mono text-base">{formatCurrency(order.totalAmount, order.currency || "USD")}</span>
              </div>
            </div>
          </div>

          {/* Operational Controls: Status & Shipping */}
          {hasPermission("orders.update") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Order Lifecycle Updater Card */}
              <div className="border border-[#E6E2EA] bg-white rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
                <form onSubmit={handleUpdateStatus} className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#6B6F80] border-b border-[#E6E2EA] pb-3 mb-4">
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
                      variant="primary"
                      size="sm"
                      className="w-full shadow-xs"
                      isLoading={actionLoading}
                    >
                      Save Status
                    </Button>
                  </div>
                </form>
              </div>

              {/* Shipping & Tracking Updater Card */}
              <div className="border border-[#E6E2EA] bg-white rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
                <form onSubmit={handleUpdateShipping} className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#6B6F80] border-b border-[#E6E2EA] pb-3 mb-4">
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
                      variant="primary"
                      size="sm"
                      className="w-full shadow-xs"
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
          <div className="border border-[#E6E2EA] bg-white rounded-2xl p-6 space-y-3 text-xs shadow-xs">
            <div className="flex items-center gap-2 border-b border-[#E6E2EA] pb-3">
              <Icons.User size={16} className="text-[#0C134F]" />
              <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#121735]">
                Customer Details
              </h3>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-[#121735]">{order.customer?.name}</p>
              <p className="text-[#6B6F80]">{order.customer?.email}</p>
              {order.customer?.phone && (
                <p className="text-[#6B6F80] font-mono mt-1">{order.customer?.phone}</p>
              )}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="border border-[#E6E2EA] bg-white rounded-2xl p-6 space-y-3 text-xs shadow-xs">
            <div className="flex items-center gap-2 border-b border-[#E6E2EA] pb-3">
              <Icons.Delivery size={16} className="text-[#0C134F]" />
              <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#121735]">
                Shipping Destination
              </h3>
            </div>
            <div className="leading-relaxed text-[#6B6F80] space-y-0.5">
              <p className="font-semibold text-[#121735]">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress?.addressLine2}</p>}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p className="mt-1 font-mono text-[11px]">{order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Notes Card */}
          {order.notes && (
            <div className="border border-[#E6E2EA] bg-white rounded-2xl p-6 space-y-2 text-xs shadow-xs">
              <div className="flex items-center gap-2 border-b border-[#E6E2EA] pb-3">
                <Icons.Edit size={16} className="text-[#0C134F]" />
                <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#121735]">
                  Order Notes
                </h3>
              </div>
              <p className="text-[#6B6F80] italic leading-relaxed">{order.notes}</p>
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
            <div className="max-h-[55vh] overflow-auto flex items-center justify-center bg-[#FBF9F5] p-3 rounded-xl border border-[#E6E2EA]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proofUrl}
                alt="Uploaded Payment Receipt"
                className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-2xs"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#E6E2EA]">
              <a
                href={proofUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#6B6F80] hover:text-[#0C134F] underline font-medium"
              >
                Open image in new tab
              </a>
              <div className="flex gap-2">
                {hasPermission("orders.update") && order.paymentStatus !== "paid" && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleApprovePayment}
                      isLoading={actionLoading}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setIsRejectModalOpen(true)}
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
            <div className="flex justify-end gap-3 pt-3 border-t border-[#E6E2EA]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRejectModalOpen(false)}
                disabled={actionLoading}
                className="border-[#E6E2EA] text-[#6B6F80]"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRejectPayment}
                isLoading={actionLoading}
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
            <div className="flex justify-end gap-3 pt-3 border-t border-[#E6E2EA]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={actionLoading}
                className="border-[#E6E2EA] text-[#6B6F80]"
              >
                Keep Order
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancelOrder}
                isLoading={actionLoading}
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
