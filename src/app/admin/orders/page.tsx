"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminOrder } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
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
      header: "Order #",
      cell: (row) => (
        <Link
          href={`/admin/orders/${row._id}`}
          className="font-medium text-foreground hover:underline font-mono text-xs"
        >
          {row.orderNumber}
        </Link>
      ),
    },
    {
      header: "Customer",
      cell: (row) => (
        <div>
          <p className="font-medium text-xs text-foreground">{row.customer?.name}</p>
          <p className="text-[11px] text-foreground-muted">{row.customer?.email}</p>
        </div>
      ),
    },
    {
      header: "Date",
      cell: (row) => (
        <span className="text-xs text-foreground-muted">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      header: "Method",
      cell: (row) => (
        <span className="text-xs uppercase tracking-wider font-mono text-foreground-muted">
          {row.paymentMethod?.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Payment",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <StatusBadge status={row.paymentStatus} />
          {row.paymentProof?.url && (
            <span
              title="Payment proof attached"
              className="text-foreground-muted hover:text-foreground"
            >
              <Icons.ShieldCheck size={14} />
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Order Status",
      cell: (row) => <StatusBadge status={row.orderStatus} />,
    },
    {
      header: "Total",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-xs">
          {formatCurrency(row.totalAmount, row.currency || "USD")}
        </span>
      ),
    },
    {
      header: "Actions",
      align: "right",
      cell: (row) => (
        <Link href={`/admin/orders/${row._id}`}>
          <Button variant="ghost" size="sm">
            Details →
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-medium block">
            Fulfillment & Sales
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
            Orders Management
          </h1>
        </div>
        <div className="text-xs text-foreground-muted">
          Total orders: <span className="font-semibold text-foreground">{totalCount}</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 text-status-error text-xs font-medium">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-surface p-4 border border-border">
        <Input
          placeholder="Search by order #, customer, email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="text-xs"
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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setSearch("");
              setOrderStatus("");
              setPaymentStatus("");
              setPage(1);
            }}
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>

      </div>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        emptyMessage="No orders found matching the filter criteria."
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
