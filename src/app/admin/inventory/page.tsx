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

  // Consolidated Stock Management Modal
  const [selectedItem, setSelectedItem] = useState<AdminInventoryItem | null>(null);
  const [mode, setMode] = useState<"adjust" | "direct">("adjust");
  const [adjustmentValue, setAdjustmentValue] = useState<string>("");
  const [directQuantity, setDirectQuantity] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleOpenManageStock = (item: AdminInventoryItem, initialMode: "adjust" | "direct" = "adjust") => {
    setSelectedItem(item);
    setMode(initialMode);
    setAdjustmentValue("");
    setDirectQuantity(String(item.quantity));
    setReason("");
    setError(null);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setAdjustmentValue("");
    setDirectQuantity("");
    setReason("");
    setError(null);
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (mode === "adjust") {
      const numAdj = Number(adjustmentValue);
      if (!numAdj || isNaN(numAdj)) {
        setError("Please enter a non-zero adjustment number (e.g. +10 or -5).");
        return;
      }
      if (!reason.trim() || reason.trim().length < 2) {
        setError("Please provide an audit reason of at least 2 characters.");
        return;
      }

      const projected = selectedItem.quantity + numAdj;
      if (projected < (selectedItem.reservedQuantity || 0)) {
        setError(`Adjustment cannot reduce stock below reserved quantity (${selectedItem.reservedQuantity || 0}).`);
        return;
      }

      try {
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);
        await adminService.adjustInventoryStock({
          variantSku: selectedItem.variantSku,
          productId: selectedItem.product?._id,
          adjustment: numAdj,
          reason: reason.trim(),
        });
        setSuccessMessage(`Stock successfully adjusted by ${numAdj > 0 ? `+${numAdj}` : numAdj} for SKU ${selectedItem.variantSku}.`);
        handleCloseModal();
        fetchInventory();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to adjust stock");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const numQty = Number(directQuantity);
      if (isNaN(numQty) || numQty < 0) {
        setError("New quantity must be a non-negative number.");
        return;
      }
      if (numQty < (selectedItem.reservedQuantity || 0)) {
        setError(`Quantity cannot be lower than current reserved stock (${selectedItem.reservedQuantity || 0}).`);
        return;
      }

      try {
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);
        await adminService.updateInventoryQuantity(
          selectedItem._id,
          numQty,
          reason.trim() || "Direct stock count update"
        );
        setSuccessMessage(`Stock level for ${selectedItem.variantSku} updated to ${numQty} units.`);
        handleCloseModal();
        fetchInventory();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to update quantity");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const numAdj = Number(adjustmentValue) || 0;
  const projectedStock = selectedItem ? selectedItem.quantity + numAdj : 0;
  const numDirect = Number(directQuantity);
  const directDelta = selectedItem && !isNaN(numDirect) ? numDirect - selectedItem.quantity : 0;

  const columns: Column<AdminInventoryItem>[] = [
    {
      header: "Product / Fragrance",
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-surface-subtle border border-border flex items-center justify-center font-serif text-foreground-muted rounded-md shrink-0">
            <Icons.Package size={16} />
          </div>
          <div>
            <span className="font-semibold text-xs text-foreground block">
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
        <div>
          <span className="font-bold text-xs font-mono text-foreground">
            {row.quantity} units
          </span>
          {row.quantity <= (row.lowStockThreshold ?? 5) && row.quantity > 0 && (
            <span className="block text-[10px] text-amber-600 font-medium">Low stock</span>
          )}
          {row.quantity === 0 && (
            <span className="block text-[10px] text-rose-600 font-medium">Out of stock</span>
          )}
        </div>
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
            <TableActionButton
              variant="outline"
              onClick={() => handleOpenManageStock(row)}
            >
              Manage Stock
            </TableActionButton>
          )}
        </TableActionGroup>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="STORE MANAGEMENT"
        title="Inventory"
        description="Monitor physical stock levels, manage replenishment thresholds, and record stock adjustments."
        count={totalCount}
        breadcrumbs={[{ label: "Inventory" }]}
      />

      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 text-status-error text-xs font-medium rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-status-success/10 border border-status-success/20 text-status-success text-xs font-medium rounded-lg">
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
            Low Stock Only
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

      {/* Consolidated Manage Stock Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={handleCloseModal}
          title="Manage Stock"
          maxWidth="md"
        >
          <form onSubmit={handleSaveStock} className="space-y-5 font-sans">
            {/* Item Overview Banner */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {selectedItem.product?.name || "Product"}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  SKU: <span className="font-semibold text-slate-700">{selectedItem.variantSku}</span>
                  {selectedItem.size ? ` • Size: ${selectedItem.size}` : ""}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Current Stock</span>
                <span className="text-sm font-bold font-mono text-slate-900">{selectedItem.quantity} units</span>
                {selectedItem.reservedQuantity ? (
                  <span className="text-[10px] text-amber-600 block">({selectedItem.reservedQuantity} reserved)</span>
                ) : null}
              </div>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setMode("adjust")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  mode === "adjust"
                    ? "bg-white text-[#0C134F] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ± Add / Remove Units
              </button>
              <button
                type="button"
                onClick={() => setMode("direct")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  mode === "direct"
                    ? "bg-white text-[#0C134F] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Set Exact Total
              </button>
            </div>

            {mode === "adjust" ? (
              <div className="space-y-4">
                <Input
                  label="Quantity Change (+ to add, - to subtract) *"
                  type="number"
                  placeholder="e.g. 25 or -5"
                  value={adjustmentValue}
                  onChange={(e) => setAdjustmentValue(e.target.value)}
                  required
                />

                {adjustmentValue && !isNaN(numAdj) && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs flex items-center justify-between">
                    <span className="text-blue-900">Resulting Available Stock:</span>
                    <span className={`font-mono font-bold text-sm ${projectedStock < 0 ? "text-rose-600" : "text-blue-950"}`}>
                      {projectedStock} units {numAdj > 0 ? `(+${numAdj})` : `(${numAdj})`}
                    </span>
                  </div>
                )}

                <Input
                  label="Audit / Reason Note *"
                  placeholder="e.g. Received shipment #741, warehouse stock correction"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  label="New Physical Stock Count *"
                  type="number"
                  min="0"
                  value={directQuantity}
                  onChange={(e) => setDirectQuantity(e.target.value)}
                  required
                />

                {directQuantity !== "" && !isNaN(numDirect) && (
                  <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                    <span className="text-slate-700">Stock Count Change:</span>
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {directDelta > 0 ? `+${directDelta}` : directDelta} units
                    </span>
                  </div>
                )}

                <Input
                  label="Reason / Note (optional)"
                  placeholder="e.g. Physical inventory count verified"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#0C134F] rounded-xl text-xs h-9 px-4"
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
                {mode === "adjust" ? "Apply Adjustment" : "Set Quantity"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
