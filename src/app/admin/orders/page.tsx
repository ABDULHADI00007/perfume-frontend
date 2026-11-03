"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminOrder } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TableActionButton, TableActionGroup } from "@/components/admin/TableAction";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Icons } from "@/components/ui/icons";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminOrdersPage() {
  const { hasPermission } = useAdminAuth();
  const initialCached = adminService.getCachedOrders({ page: 1, limit: 10 });
  const [orders, setOrders] = useState<AdminOrder[]>(initialCached?.orders || []);
  const [isLoading, setIsLoading] = useState(!initialCached);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialCached?.meta?.totalPages || 1);
  const [totalCount, setTotalCount] = useState(initialCached?.meta?.total || initialCached?.orders.length || 0);

  const fetchOrders = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setIsLoading(true);
      setError(null);
      const res = await adminService.getOrders({
        page,
        limit: 10,
        search: search.trim() || undefined,
        orderStatus: orderStatus || undefined,
        paymentStatus: paymentStatus || undefined,
      });
      setOrders(res.orders);
      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
        setTotalCount(res.meta.total || res.orders.length);
      }
    } catch (err: unknown) {
      if (!isSilent) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, search, orderStatus, paymentStatus]);

  useEffect(() => {
    if (hasPermission("orders.read")) {
      const hasCache = Boolean(adminService.getCachedOrders({ page, limit: 10, search: search.trim() || undefined, orderStatus: orderStatus || undefined, paymentStatus: paymentStatus || undefined }));
      fetchOrders(hasCache);
    }
  }, [fetchOrders, hasPermission, page, search, orderStatus, paymentStatus]);

  if (!hasPermission("orders.read")) {
    return <AdminAccessDenied requiredPermission="orders.read" />;
  }

  const columns: Column<AdminOrder>[] = [
    {
      header: "Order Ref",
      className: "whitespace-nowrap",
      cell: (row) => (
        <div className="min-w-[100px] sm:min-w-0">
          <Link
            href={`/admin/orders/${row._id}`}
            className="font-mono text-xs font-bold text-[#0C134F] hover:text-[#590B16] transition-colors block"
          >
            {row.orderNumber}
          </Link>
          <span className="sm:hidden text-[10px] text-slate-500 font-mono block mt-0.5 whitespace-nowrap">
            {formatDate(row.createdAt)}
          </span>
        </div>
      ),
    },
    {
      header: "Customer",
      className: "min-w-[110px] sm:min-w-0",
      cell: (row) => {
        const customerName =
          row.customerSnapshot?.name ||
          row.shippingAddress?.fullName ||
          (row.customer?.firstName
            ? `${row.customer.firstName} ${row.customer.lastName || ""}`.trim()
            : null) ||
          row.customer?.name ||
          "Customer";

        const customerEmail =
          row.customerSnapshot?.email ||
          row.customer?.email ||
          "";

        return (
          <div className="min-w-0 max-w-[120px] sm:max-w-none">
            <p className="font-semibold text-xs text-[#0C134F] truncate">{customerName}</p>
            {customerEmail && (
              <p className="text-[10.5px] text-slate-500 font-mono tracking-tight truncate">{customerEmail}</p>
            )}
          </div>
        );
      },
    },
    {
      header: "Date Placed",
      className: "hidden sm:table-cell whitespace-nowrap",
      cell: (row) => (
        <span className="text-xs text-slate-600 font-sans whitespace-nowrap">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      header: "Payment Method",
      className: "whitespace-nowrap",
      cell: (row) => (
        <span className="text-[10.5px] uppercase tracking-wider font-mono font-medium text-slate-500 whitespace-nowrap">
          {row.paymentMethod?.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Status",
      className: "whitespace-nowrap",
      cell: (row) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <StatusBadge status={row.orderStatus} size="sm" />

          {row.paymentProof?.url && (
            <span
              title="Bank wire proof attached"
              className="p-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-md shadow-2xs inline-flex items-center"
            >
              <Icons.ShieldCheck size={12} />
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Total",
      align: "right",
      className: "whitespace-nowrap text-right",
      cell: (row) => {
        const rowTotal =
          typeof row.totalAmount === "number" && row.totalAmount > 0
            ? row.totalAmount
            : typeof row.total === "number" && row.total > 0
            ? row.total
            : Math.max(0, (row.subtotal || 0) - (row.discount || row.discountAmount || 0) + (row.shippingFee || 0));

        return (
          <span className="font-bold text-xs font-mono text-[#0C134F] tabular-nums whitespace-nowrap">
            {formatCurrency(rowTotal, "PKR")}
          </span>
        );
      },
    },
    {
      header: "Action",
      align: "right",
      className: "whitespace-nowrap text-right",
      cell: (row) => (
        <TableActionGroup>
          <TableActionButton
            variant="outline"
            size="xs"
            href={`/admin/orders/${row._id}`}
            className="px-2.5 py-1 text-xs whitespace-nowrap"
          >
            Review →
          </TableActionButton>
        </TableActionGroup>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="STORE MANAGEMENT"
        title="Orders Management"
        description="Monitor customer orders, verify bank wire transfer slips, and manage fulfillment dispatch."
        count={totalCount}
        breadcrumbs={[{ label: "Orders" }]}
      />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-2xl shadow-2xs">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <AdminFilterBar
        hasActiveFilters={Boolean(search || orderStatus || paymentStatus)}
        resetLabel="CLEAR"
        onReset={() => {
          setSearch("");
          setOrderStatus("");
          setPaymentStatus("");
          setPage(1);
        }}
      >
        <Input
          placeholder="Search by order #, customer, email..."
          value={search}
          leftIcon={<Icons.Search size={15} className="text-slate-400" />}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full text-xs"
        />

        <Select
          value={orderStatus}
          onChange={(e) => {
            setOrderStatus(e.target.value);
            setPage(1);
          }}
          options={[
            { label: "All Statuses", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Delivered", value: "delivered" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ]}
        />

        <Select
          value={paymentStatus}
          onChange={(e) => {
            setPaymentStatus(e.target.value);
            setPage(1);
          }}
          options={[
            { label: "All Payments", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Paid", value: "paid" },
            { label: "Failed / Rejected", value: "failed" },
          ]}
        />
      </AdminFilterBar>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        emptyMessage="No customer orders match the applied filters."
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}
