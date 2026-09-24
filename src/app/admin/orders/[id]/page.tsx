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
      <div className="py-20 text-center">
        <Spinner size="lg" className="mx-auto mb-3 text-foreground-muted" />
        <p className="text-xs text-foreground-muted uppercase tracking-wider">Loading Order Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-surface border border-border p-8 text-center max-w-md mx-auto my-12">
        <p className="text-sm text-foreground-muted mb-4">Order not found.</p>
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
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center space-x-2 text-xs text-foreground-muted">
          <Link href="/admin/orders" className="hover:text-foreground">
            Orders
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium font-mono">{order.orderNumber}</span>
        </div>

        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            ← Back to Orders
          </Button>
        </Link>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-surface p-6 border border-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl text-foreground font-normal">
              Order <span className="font-mono text-xl">{order.orderNumber}</span>
            </h1>
            <StatusBadge status={order.orderStatus} />
            <StatusBadge status={order.paymentStatus} />
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Placed on {formatDate(order.createdAt)} • Payment Method:{" "}
            <span className="font-semibold text-foreground uppercase tracking-wider font-mono">
              {order.paymentMethod?.replace(/_/g, " ")}
            </span>
          </p>
        </div>

        {hasPermission("orders.cancel") && order.orderStatus !== "cancelled" && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsCancelModalOpen(true)}
            disabled={actionLoading}
          >
            Cancel Order
          </Button>
        )}
      </div>

      {/* Feedback Alerts */}
      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 text-status-error text-xs font-medium">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-status-success/10 border border-status-success/20 text-status-success text-xs font-medium">
          {successMessage}
        </div>
      )}

      {/* Payment Proof Banner / Review Card if Bank Transfer */}
      {order.paymentMethod === "bank_transfer" && (
        <div className="border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <Icons.ShieldCheck size={18} className="text-primary" />
              <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground">
                Bank Transfer Payment Proof
              </h3>
            </div>
            <StatusBadge status={order.paymentStatus} />
          </div>

          {proofUrl ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-subtle p-4 border border-border">
              <div>
                <p className="text-xs font-medium text-foreground">
                  Proof File: {order.paymentProof?.originalName || "Payment Receipt"}
                </p>
                {order.paymentProof?.submittedAt && (
                  <p className="text-[11px] text-foreground-muted mt-0.5">
                    Submitted: {formatDate(order.paymentProof.submittedAt)}
                  </p>
                )}
                {order.paymentProof?.rejectionReason && (
                  <p className="text-xs text-status-error mt-1 font-medium">
                    Rejection Reason: {order.paymentProof.rejectionReason}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProofModalOpen(true)}
                >
                  <Icons.ExternalLink size={14} className="mr-1.5" />
                  View Receipt
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
                      variant="danger"
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
            <p className="text-xs text-foreground-muted italic">
              No payment receipt has been submitted by the customer yet.
            </p>
          )}
        </div>
      )}

      {/* Main Order Content 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Items & Financials */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table */}
          <div className="border border-border bg-surface p-6">
            <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground mb-4">
              Ordered Fragrances ({order.items?.length || 0})
            </h3>

            <div className="divide-y divide-border-subtle">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-surface-subtle border border-border flex items-center justify-center font-serif text-foreground-muted">
                      <Icons.Package size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {typeof item.productId === "object" ? item.productId.name : item.name || "Fragrance"}
                      </p>
                      <p className="text-[11px] text-foreground-muted">
                        SKU: {item.sku} {item.size ? `• ${item.size}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-foreground">
                      {item.quantity} × {formatCurrency(item.unitPrice, order.currency || "USD")}
                    </p>
                    <p className="font-semibold text-foreground font-mono">
                      {formatCurrency(item.totalPrice, order.currency || "USD")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals Summary */}
            <div className="mt-6 pt-4 border-t border-border space-y-2 text-xs">
              <div className="flex justify-between text-foreground-muted">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(order.subtotal, order.currency || "USD")}</span>
              </div>
              {order.discountAmount ? (
                <div className="flex justify-between text-status-success font-medium">
                  <span>Discount ({order.couponCode || "Coupon"})</span>
                  <span className="font-mono">-{formatCurrency(order.discountAmount, order.currency || "USD")}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-foreground-muted">
                <span>Shipping Fee</span>
                <span className="font-mono">{formatCurrency(order.shippingFee, order.currency || "USD")}</span>
              </div>
              {order.taxAmount ? (
                <div className="flex justify-between text-foreground-muted">
                  <span>Estimated Tax</span>
                  <span className="font-mono">{formatCurrency(order.taxAmount, order.currency || "USD")}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-sm font-semibold text-foreground pt-2 border-t border-border-subtle">
                <span>Total Amount</span>
                <span className="font-mono">{formatCurrency(order.totalAmount, order.currency || "USD")}</span>
              </div>
            </div>
          </div>

          {/* Operational Controls: Status & Shipping */}
          {hasPermission("orders.update") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Status Updater */}
              <div className="border border-border bg-surface p-6">
                <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground mb-4">
                  Update Order Lifecycle
                </h3>
                <form onSubmit={handleUpdateStatus} className="space-y-4">
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
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="w-full"
                    isLoading={actionLoading}
                  >
                    Save Status
                  </Button>
                </form>
              </div>

              {/* Shipping Tracking Updater */}
              <div className="border border-border bg-surface p-6">
                <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground mb-4">
                  Shipping & Tracking
                </h3>
                <form onSubmit={handleUpdateShipping} className="space-y-3">
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
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    isLoading={actionLoading}
                  >
                    Save Tracking
                  </Button>

                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Customer & Delivery Addresses */}
        <div className="space-y-6">
          {/* Customer Profile Card */}
          <div className="border border-border bg-surface p-6 space-y-3 text-xs">
            <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground border-b border-border-subtle pb-2">
              Customer Details
            </h3>
            <div>
              <p className="font-semibold text-foreground">{order.customer?.name}</p>
              <p className="text-foreground-muted">{order.customer?.email}</p>
              {order.customer?.phone && (
                <p className="text-foreground-muted font-mono">{order.customer?.phone}</p>
              )}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="border border-border bg-surface p-6 space-y-3 text-xs">
            <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground border-b border-border-subtle pb-2">
              Shipping Destination
            </h3>
            <div className="leading-relaxed text-foreground-muted">
              <p className="font-semibold text-foreground">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress?.addressLine2}</p>}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p className="mt-1 font-mono">{order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Notes if present */}
          {order.notes && (
            <div className="border border-border bg-surface p-6 space-y-2 text-xs">
              <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground border-b border-border-subtle pb-2">
                Order Notes
              </h3>
              <p className="text-foreground-muted italic leading-relaxed">{order.notes}</p>
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
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="max-h-[60vh] overflow-auto flex items-center justify-center bg-surface-subtle p-2 border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proofUrl}
                alt="Uploaded Payment Receipt"
                className="max-w-full max-h-[55vh] object-contain"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <a
                href={proofUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-foreground-muted hover:text-foreground underline"
              >
                Open in new window
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
                      variant="danger"
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
          title="Reject Bank Transfer Proof"
          maxWidth="sm"
        >
          <div className="space-y-4 font-sans">
            <p className="text-xs text-foreground-muted">
              Please specify the reason why this payment receipt is rejected (e.g. illegible screenshot, amount mismatch, invalid transaction ID).
            </p>
            <Input
              label="Rejection Reason (min 3 chars)"
              placeholder="e.g. Transaction amount does not match order subtotal"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRejectModalOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
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
          maxWidth="sm"
        >
          <div className="space-y-4 font-sans">
            <p className="text-xs text-foreground-muted">
              Are you sure you want to cancel order <span className="font-mono font-semibold">{order.orderNumber}</span>?
            </p>
            <Input
              label="Cancellation Reason (optional)"
              placeholder="e.g. Customer requested cancellation"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={actionLoading}
              >
                Keep Order
              </Button>
              <Button
                variant="danger"
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
