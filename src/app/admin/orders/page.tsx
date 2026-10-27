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
      cell: (row) => (
        <Link
          href={`/admin/orders/${row._id}`}
          className="font-mono text-xs font-bold text-[#0C134F] hover:text-[#590B16] transition-colors"
        >
          {row.orderNumber}
        </Link>
      ),
    },
    {
      header: "Customer",
      cell: (row) => (
        <div>
          <p className="font-semibold text-xs text-[#0C134F]">{row.customer?.name || "Guest"}</p>
          <p className="text-[11px] text-slate-500 font-mono tracking-tight">{row.customer?.email}</p>
        </div>
      ),
    },
    {
      header: "Date Placed",
      cell: (row) => (
        <span className="text-xs text-slate-600 font-sans">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      header: "Payment Method",
      cell: (row) => (
        <span className="text-[10.5px] uppercase tracking-wider font-mono font-medium text-slate-500">
          {row.paymentMethod?.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Payment Status",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <StatusBadge status={row.paymentStatus} />
          {row.paymentProof?.url && (
            <span
              title="Bank wire proof attached"
              className="p-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-md shadow-2xs"
            >
              <Icons.ShieldCheck size={12} />
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Fulfillment",
      cell: (row) => <StatusBadge status={row.orderStatus} />,
    },
    {
      header: "Total",
      align: "right",
      cell: (row) => (
        <span className="font-bold text-xs font-mono text-[#0C134F] tabular-nums">
          {formatCurrency(row.totalAmount, "PKR")}
        </span>
      ),
    },
    {
      header: "Action",
      align: "right",
      cell: (row) => (
        <TableActionGroup>
          <TableActionButton
            variant="outline"
            href={`/admin/orders/${row._id}`}
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
            { label: "All Order Statuses", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Awaiting Verification", value: "awaiting_payment_verification" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Processing", value: "processing" },
            { label: "Shipped", value: "shipped" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancelled", value: "cancelled" },
            { label: "Refunded", value: "refunded" },
          ]}
        />

        <Select
          value={paymentStatus}
          onChange={(e) => {
            setPaymentStatus(e.target.value);
            setPage(1);
          }}
          options={[
            { label: "All Payment Statuses", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Pending Verification", value: "pending_verification" },
            { label: "Paid", value: "paid" },
            { label: "Rejected", value: "rejected" },
            { label: "Failed", value: "failed" },
            { label: "Refunded", value: "refunded" },
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
