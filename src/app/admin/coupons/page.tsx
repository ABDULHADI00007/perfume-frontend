"use client";

import React, { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/services/adminService";
import { AdminCoupon } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { TableActionButton, TableActionGroup } from "@/components/admin/TableAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/ui/icons";
import { formatDate, formatCurrency } from "@/lib/utils";


export default function AdminCouponsPage() {
  const { hasPermission } = useAdminAuth();
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<string>("");
  const [minimumOrderAmount, setMinimumOrderAmount] = useState<string>("");
  const [maximumDiscountAmount, setMaximumDiscountAmount] = useState<string>("");
  const [usageLimit, setUsageLimit] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  // Delete State
  const [couponToDelete, setCouponToDelete] = useState<AdminCoupon | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminService.getCoupons();
      setCoupons(res.coupons);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load coupons");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasPermission("coupons.read")) {
      fetchCoupons();
    }
  }, [fetchCoupons, hasPermission]);

  if (!hasPermission("coupons.read")) {
    return <AdminAccessDenied requiredPermission="coupons.read" />;
  }

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setCode("");
    setDescription("");
    setDiscountType("percentage");
    setDiscountValue("");
    setMinimumOrderAmount("");
    setMaximumDiscountAmount("");
    setUsageLimit("");
    // Default 30 days expiry
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    setExpiresAt(futureDate.toISOString().split("T")[0]);
    setStatus("active");
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: AdminCoupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDescription(c.description || "");
    setDiscountType(c.discountType);
    setDiscountValue(String(c.discountValue));
    setMinimumOrderAmount(c.minimumOrderAmount ? String(c.minimumOrderAmount) : "");
    setMaximumDiscountAmount(c.maximumDiscountAmount ? String(c.maximumDiscountAmount) : "");
    setUsageLimit(c.usageLimit ? String(c.usageLimit) : "");
    setExpiresAt(c.expiresAt ? new Date(c.expiresAt).toISOString().split("T")[0] : "");
    setStatus(c.status === "active" ? "active" : "inactive");
    setError(null);
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.trim().length < 3) {
      setError("Coupon code must be at least 3 characters.");
      return;
    }
    const val = Number(discountValue);
    if (!val || isNaN(val) || val <= 0) {
      setError("Discount value must be greater than 0.");
      return;
    }
    if (!expiresAt) {
      setError("Expiration date is required.");
      return;
    }

    const payload: Partial<AdminCoupon> = {
      code: code.trim().toUpperCase(),
      description: description.trim() || undefined,
      discountType,
      discountValue: val,
      minimumOrderAmount: minimumOrderAmount ? Number(minimumOrderAmount) : undefined,
      maximumDiscountAmount: maximumDiscountAmount ? Number(maximumDiscountAmount) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      expiresAt: new Date(expiresAt).toISOString(),
      status,
    };

    try {
      setIsSubmitting(true);
      setError(null);
      if (editingCoupon) {
        await adminService.updateCoupon(editingCoupon._id, payload);
        setSuccessMessage(`Coupon ${payload.code} updated.`);
      } else {
        await adminService.createCoupon(payload);
        setSuccessMessage(`Coupon ${payload.code} created.`);
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (c: AdminCoupon) => {
    try {
      setIsLoading(true);
      setError(null);
      await adminService.deactivateCoupon(c._id);
      setSuccessMessage(`Coupon ${c.code} status changed.`);
      fetchCoupons();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to change status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;
    try {
      setIsDeleteLoading(true);
      setError(null);
      await adminService.deleteCoupon(couponToDelete._id);
      setSuccessMessage(`Coupon ${couponToDelete.code} deleted.`);
      setCouponToDelete(null);
      fetchCoupons();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete coupon");
      setCouponToDelete(null);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const columns: Column<AdminCoupon>[] = [
    {
      header: "Code",
      cell: (row) => (
        <div>
          <span className="font-bold text-xs font-mono text-foreground tracking-wider">
            {row.code}
          </span>
          {row.description && (
            <p className="text-[11px] text-foreground-muted">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      header: "Discount",
      cell: (row) => (
        <span className="font-semibold text-xs font-mono text-foreground">
          {row.discountType === "percentage"
            ? `${row.discountValue}% OFF`
            : `${formatCurrency(row.discountValue)} OFF`}
        </span>
      ),
    },
    {
      header: "Usage / Limits",
      cell: (row) => (
        <div className="text-xs text-foreground-muted">
          <span>
            {row.usageCount || 0} / {row.usageLimit ? `${row.usageLimit} max` : "∞"}
          </span>
          {row.minimumOrderAmount ? (
            <p className="text-[10px] text-foreground-subtle">
              Min: {formatCurrency(row.minimumOrderAmount)}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      header: "Expires",
      cell: (row) => (
        <span className="text-xs text-foreground-muted">{formatDate(row.expiresAt)}</span>
      ),
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      align: "right",
      cell: (row) => (
        <TableActionGroup>
          {hasPermission("coupons.update") && (
            <>
              <TableActionButton
                variant="outline"
                onClick={() => handleOpenEdit(row)}
              >
                Edit
              </TableActionButton>
              <TableActionButton
                variant={row.status === "active" ? "ghost" : "success"}
                onClick={() => handleToggleStatus(row)}
              >
                {row.status === "active" ? "Deactivate" : "Activate"}
              </TableActionButton>
              <TableActionButton
                variant="destructive"
                onClick={() => setCouponToDelete(row)}
              >
                Delete
              </TableActionButton>
            </>
          )}
        </TableActionGroup>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="PROMOTIONS & MARKETING"
        title="Discount Coupons"
        description="Configure promotional vouchers, percentage discounts, minimum thresholds, and redemption caps."
        count={coupons.length}
        breadcrumbs={[{ label: "Coupons" }]}
        actions={
          hasPermission("coupons.create") && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="bg-[#0C134F] hover:bg-[#121A4B] text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <Icons.Plus size={14} />
              <span>Create Coupon</span>
            </Button>
          )
        }
      />

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

      <DataTable
        columns={columns}
        data={coupons}
        isLoading={isLoading}
        emptyMessage="No promotional coupons created yet."
      />

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCoupon ? "Edit Coupon" : "Create Promotional Coupon"}
          maxWidth="md"
        >
          <form onSubmit={handleSaveCoupon} className="space-y-4 font-sans">
            <Input
              label="Promo Code *"
              placeholder="e.g. MAISON20"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Discount Type"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                options={[
                  { label: "Percentage (%)", value: "percentage" },
                  { label: "Fixed Amount ($)", value: "fixed" },
                ]}
              />

              <Input
                label="Discount Value *"
                type="number"
                step="0.01"
                min="0.01"
                placeholder={discountType === "percentage" ? "20" : "50.00"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Min Order Amount ($)"
                type="number"
                placeholder="100.00"
                value={minimumOrderAmount}
                onChange={(e) => setMinimumOrderAmount(e.target.value)}
              />

              <Input
                label="Max Discount ($)"
                type="number"
                placeholder="50.00"
                value={maximumDiscountAmount}
                onChange={(e) => setMaximumDiscountAmount(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Usage Limit"
                type="number"
                placeholder="e.g. 100"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
              />

              <Input
                label="Expires On *"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
              />
            </div>

            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />

            <Textarea
              label="Description (optional)"
              placeholder="Campaign notes or terms..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="border-slate-200 text-slate-600 hover:bg-[#FAF7EE] hover:text-[#590B16] rounded-xl text-xs h-9 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="brand"
                size="sm"
                isLoading={isSubmitting}
                className="rounded-xl text-xs font-bold uppercase tracking-wider h-9 px-5 shadow-xs"
              >
                {editingCoupon ? "Save Changes" : "Create Coupon"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(couponToDelete)}
        onClose={() => setCouponToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon "${couponToDelete?.code}"?`}
        confirmLabel="Delete Coupon"
        isDestructive
        isLoading={isDeleteLoading}
      />
    </div>
  );
}
