"use client";

import React, { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/services/adminService";
import { AdminInventoryItem } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TableActionButton, TableActionGroup } from "@/components/admin/TableAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Icons } from "@/components/ui/icons";

export default function AdminInventoryPage() {
  const { hasPermission } = useAdminAuth();
  const [items, setItems] = useState<AdminInventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Stock Adjustment Modal
  const [selectedItemForAdjust, setSelectedItemForAdjust] = useState<AdminInventoryItem | null>(null);
  const [adjustmentValue, setAdjustmentValue] = useState<string>("");
  const [adjustmentReason, setAdjustmentReason] = useState<string>("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  // Direct Quantity Override Modal
  const [selectedItemForDirect, setSelectedItemForDirect] = useState<AdminInventoryItem | null>(null);
  const [directQuantity, setDirectQuantity] = useState<string>("");
  const [directReason, setDirectReason] = useState<string>("");
  const [isDirectUpdating, setIsDirectUpdating] = useState(false);

  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminService.getInventory({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        lowStock: lowStockOnly ? "true" : undefined,
      });
      setItems(res.items);
      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
        setTotalCount(res.meta.total || res.items.length);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load inventory");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter, lowStockOnly]);

  useEffect(() => {
    if (hasPermission("inventory.read")) {
      fetchInventory();
    }
  }, [fetchInventory, hasPermission]);

  if (!hasPermission("inventory.read")) {
    return <AdminAccessDenied requiredPermission="inventory.read" />;
  }

  const handleOpenAdjust = (item: AdminInventoryItem) => {
    setSelectedItemForAdjust(item);
    setAdjustmentValue("");
    setAdjustmentReason("");
    setError(null);
  };

  const handleOpenDirect = (item: AdminInventoryItem) => {
    setSelectedItemForDirect(item);
    setDirectQuantity(String(item.quantity));
    setDirectReason("");
    setError(null);
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForAdjust) return;

    const numAdj = Number(adjustmentValue);
    if (!numAdj || isNaN(numAdj)) {
      setError("Please enter a non-zero adjustment number.");
      return;
    }
    if (!adjustmentReason.trim() || adjustmentReason.trim().length < 2) {
      setError("Adjustment reason must be at least 2 characters.");
      return;
    }

    try {
      setIsAdjusting(true);
      setError(null);
      setSuccessMessage(null);
      await adminService.adjustInventoryStock({
        variantSku: selectedItemForAdjust.variantSku,
        productId: selectedItemForAdjust.product?._id,
        adjustment: numAdj,
        reason: adjustmentReason.trim(),
      });
      setSuccessMessage(`Stock adjusted for SKU ${selectedItemForAdjust.variantSku}.`);
      setSelectedItemForAdjust(null);
      fetchInventory();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to adjust stock");
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleSaveDirectQuantity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForDirect) return;

    const numQty = Number(directQuantity);
    if (isNaN(numQty) || numQty < 0) {
      setError("Quantity must be a non-negative number.");
      return;
    }

    try {
      setIsDirectUpdating(true);
      setError(null);
      setSuccessMessage(null);
      await adminService.updateInventoryQuantity(
        selectedItemForDirect._id,
        numQty,
        directReason.trim() || undefined
      );
      setSuccessMessage(`Quantity updated for ${selectedItemForDirect.variantSku}.`);
      setSelectedItemForDirect(null);
      fetchInventory();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update quantity");
    } finally {
      setIsDirectUpdating(false);
    }
  };

  const columns: Column<AdminInventoryItem>[] = [
    {
      header: "Product / Fragrance",
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-surface-subtle border border-border flex items-center justify-center font-serif text-foreground-muted">
            <Icons.Package size={16} />
          </div>
          <div>
            <span className="font-semibold text-xs text-foreground">
              {row.product?.name || "Product"}
            </span>
            <p className="text-[11px] text-foreground-muted font-mono">
              SKU: {row.variantSku} {row.size ? `• ${row.size}` : ""}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Available Stock",
      cell: (row) => (
        <span className="font-bold text-xs font-mono text-foreground">
          {row.quantity} units
        </span>
      ),
    },
    {
      header: "Reserved",
      cell: (row) => (
        <span className="text-xs text-foreground-muted font-mono">
          {row.reservedQuantity || 0}
        </span>
      ),
    },
    {
      header: "Threshold",
      cell: (row) => (
        <span className="text-xs text-foreground-muted font-mono">
          {row.lowStockThreshold ?? 5}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) => {
        const computedStatus =
          row.quantity === 0
            ? "out_of_stock"
            : row.quantity <= (row.lowStockThreshold ?? 5)
              ? "low_stock"
              : "in_stock";
        return <StatusBadge status={row.status || computedStatus} />;
      },
    },
    {
      header: "Actions",
      align: "right",
      cell: (row) => (
        <TableActionGroup>
          {hasPermission("inventory.adjust") && (
            <>
              <TableActionButton
                variant="outline"
                onClick={() => handleOpenAdjust(row)}
              >
                ± Adjust
              </TableActionButton>
              <TableActionButton
                variant="ghost"
                onClick={() => handleOpenDirect(row)}
              >
                Set Qty
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
        category="WAREHOUSE & LOGISTICS"
        title="Inventory Management"
        description="Monitor physical stock levels, manage replenishment thresholds, and record stock adjustments."
        count={totalCount}
        breadcrumbs={[{ label: "Inventory" }]}
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

      {/* Filter Bar */}
      <AdminFilterBar
        hasActiveFilters={Boolean(search || statusFilter || lowStockOnly)}
        resetLabel="RESET FILTERS"
        onReset={() => {
          setSearch("");
          setStatusFilter("");
          setLowStockOnly(false);
          setPage(1);
        }}
      >
        <Input
          placeholder="Search by product name or SKU..."
          value={search}
          leftIcon={<Icons.Search size={15} className="text-[#64748B]" />}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full text-xs"
        />

        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          options={[
            { label: "All Inventory Statuses", value: "" },
            { label: "In Stock", value: "in_stock" },
            { label: "Low Stock", value: "low_stock" },
            { label: "Out of Stock", value: "out_of_stock" },
          ]}
        />

        <div className="flex items-center space-x-2 bg-[#FAF8F5] px-3.5 py-2.5 rounded-xl border border-[#E6E2EA] h-10">
          <input
            type="checkbox"
            id="low-stock-toggle"
            checked={lowStockOnly}
            onChange={(e) => {
              setLowStockOnly(e.target.checked);
              setPage(1);
            }}
            className="w-4 h-4 text-[#0C134F] rounded border-[#E6E2EA] cursor-pointer"
          />
          <label htmlFor="low-stock-toggle" className="text-xs text-[#0B1938] font-medium cursor-pointer select-none">
            Low Stock Alerts Only
          </label>
        </div>
      </AdminFilterBar>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyMessage="No inventory records found."
      />

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {selectedItemForAdjust && (
        <Modal
          isOpen={Boolean(selectedItemForAdjust)}
          onClose={() => setSelectedItemForAdjust(null)}
          title="Adjust Stock Quantity"
          maxWidth="sm"
        >
          <form onSubmit={handleSaveAdjustment} className="space-y-4 font-sans">
            <div>
              <p className="text-xs font-semibold text-foreground">
                {selectedItemForAdjust.product?.name}
              </p>
              <p className="text-[11px] text-foreground-muted font-mono">
                SKU: {selectedItemForAdjust.variantSku} • Current Stock: {selectedItemForAdjust.quantity}
              </p>
            </div>

            <Input
              label="Stock Adjustment (+ to add, - to subtract) *"
              type="number"
              placeholder="e.g. 20 or -5"
              value={adjustmentValue}
              onChange={(e) => setAdjustmentValue(e.target.value)}
              required
            />

            <Input
              label="Audit Reason *"
              placeholder="e.g. Restock batch #401, Inventory reconciliation"
              value={adjustmentReason}
              onChange={(e) => setAdjustmentReason(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedItemForAdjust(null)}
                disabled={isAdjusting}
                className="border-slate-200 text-slate-600 hover:bg-[#FAF7EE] hover:text-[#590B16] rounded-xl text-xs h-9 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="brand"
                size="sm"
                isLoading={isAdjusting}
                className="rounded-xl text-xs font-bold uppercase tracking-wider h-9 px-5 shadow-xs"
              >
                Apply Adjustment
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Direct Quantity Set Modal */}
      {selectedItemForDirect && (
        <Modal
          isOpen={Boolean(selectedItemForDirect)}
          onClose={() => setSelectedItemForDirect(null)}
          title="Set Exact Quantity"
          maxWidth="sm"
        >
          <form onSubmit={handleSaveDirectQuantity} className="space-y-4 font-sans">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                {selectedItemForDirect.product?.name}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                SKU: {selectedItemForDirect.variantSku}
              </p>
            </div>

            <Input
              label="New Exact Stock Count *"
              type="number"
              min="0"
              value={directQuantity}
              onChange={(e) => setDirectQuantity(e.target.value)}
              required
            />

            <Input
              label="Reason (optional)"
              placeholder="e.g. Manual warehouse count"
              value={directReason}
              onChange={(e) => setDirectReason(e.target.value)}
            />

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedItemForDirect(null)}
                disabled={isDirectUpdating}
                className="border-slate-200 text-slate-600 hover:bg-[#FAF7EE] hover:text-[#590B16] rounded-xl text-xs h-9 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="brand"
                size="sm"
                isLoading={isDirectUpdating}
                className="rounded-xl text-xs font-bold uppercase tracking-wider h-9 px-5 shadow-xs"
              >
                Set Quantity
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
