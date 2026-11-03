"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminOrder, AdminInventoryItem, DashboardOverviewStats } from "@/features/admin/types";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TableActionButton, TableActionGroup } from "@/components/admin/TableAction";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/ui/icons";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const initialCachedStats = adminService.getCachedDashboard();
  const initialCachedOrders = adminService.getCachedOrders({ limit: 6 });

  const [stats, setStats] = useState<DashboardOverviewStats | null>(initialCachedStats);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>(initialCachedOrders?.orders || []);
  const [pendingProofOrders, setPendingProofOrders] = useState<AdminOrder[]>([]);
  const [lowStockItems, setLowStockItems] = useState<AdminInventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(!initialCachedStats);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      const hasCache = Boolean(adminService.getCachedDashboard());
      try {
        if (!hasCache) setIsLoading(true);
        setError(null);

        const [statsData, ordersRes, pendingProofsRes, lowStockRes] = await Promise.allSettled([
          adminService.getDashboardOverview(true),
          adminService.getOrders({ limit: 6 }, true),
          adminService.getOrders({ paymentStatus: "pending_verification", limit: 5 }, true),
          adminService.getInventory({ lowStock: "true", limit: 6 }, true),
        ]);

        if (statsData.status === "fulfilled") {
          setStats(statsData.value);
        }
        if (ordersRes.status === "fulfilled") {
          setRecentOrders(ordersRes.value.orders);
        }
        if (pendingProofsRes.status === "fulfilled") {
          setPendingProofOrders(pendingProofsRes.value.orders);
        }
        if (lowStockRes.status === "fulfilled") {
          setLowStockItems(lowStockRes.value.items);
        }
      } catch (err: unknown) {
        if (!hasCache) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard metrics");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const orderColumns: Column<AdminOrder>[] = [
    {
      header: "Order Reference",
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
      header: "Placed At",
      className: "hidden sm:table-cell whitespace-nowrap",
      cell: (row) => (
        <span className="text-xs text-slate-600 font-sans whitespace-nowrap">
          {formatDate(row.createdAt)}
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
      cell: (row) => (
        <span className="font-bold text-xs font-mono text-[#0C134F] tabular-nums whitespace-nowrap">
          {formatCurrency(row.totalAmount ?? (row as unknown as { total?: number }).total, "PKR")}
        </span>
      ),
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
            View →
          </TableActionButton>
        </TableActionGroup>
      ),
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Executive Header */}
      <AdminPageHeader
        category="DASHBOARD"
        title="Overview"
        description="Real-time sales, order fulfillment, and catalog overview for Soulmate Scents."
        actions={
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Link href="/admin/orders" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#0C134F] border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold shadow-2xs cursor-pointer justify-center"
              >
                View All Orders
              </Button>
            </Link>

            <Link href="/admin/products/new" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto bg-[#0C134F] hover:bg-[#121A4B] text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Icons.Plus size={14} />
                <span>Add Fragrance</span>
              </Button>
            </Link>
          </div>
        }
      />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-2xl shadow-2xs">
          {error}
        </div>
      )}

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6 space-y-3 bg-white rounded-2xl shadow-xs border border-slate-200">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-40" />
            </Card>
          ))
        ) : (
          <>
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(stats?.totalSales ?? 0, "PKR")}
              icon={<Icons.Dollar size={18} />}
              description="Gross recorded revenue"
            />
            <StatsCard
              title="Total Orders"
              value={(stats?.totalOrders ?? 0).toLocaleString()}
              icon={<Icons.Delivery size={18} />}
              description="Orders received"
            />
            <StatsCard
              title="Total Customers"
              value={(stats?.totalCustomers ?? 0).toLocaleString()}
              icon={<Icons.User size={18} />}
              description="Registered customer profiles"
            />
            <StatsCard
              title="Total Products"
              value={(stats?.totalProducts ?? 0).toLocaleString()}
              icon={<Icons.Package size={18} />}
              description="Catalog fragrances"
            />
          </>
        )}
      </div>

      {/* Operational Alert: Bank Wire Verification Awaiting Attention */}
      {pendingProofOrders.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs shrink-0">
                <Icons.ShieldCheck size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-display font-bold text-[#0C134F]">
                    Bank Transfer Payments Awaiting Verification
                  </h4>
                  <Badge variant="warning" size="sm" className="font-mono text-[10px]">
                    {pendingProofOrders.length} Pending
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Customer payment receipts have been uploaded and require verification prior to dispatch.
                </p>
              </div>
            </div>
            <Link href="/admin/orders?paymentStatus=pending_verification">
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap rounded-xl bg-white border-amber-200 text-[#0C134F] hover:bg-amber-100/50 shadow-2xs"
              >
                Review Verification Proofs →
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#0C134F]">
              Recent Orders
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Latest store orders and transaction details
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0C134F] hover:text-[#926618] transition-colors"
          >
            <span>View All Orders</span>
            <Icons.ChevronRight size={14} />
          </Link>
        </div>

        <DataTable
          columns={orderColumns}
          data={recentOrders}
          emptyMessage="No orders have been recorded yet."
        />
      </div>

      {/* Low Stock Operational Alerts */}
      {lowStockItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <h3 className="font-display text-base font-bold text-[#0C134F]">
                Low Stock Alerts
              </h3>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-[#0C134F] hover:text-[#926618] transition-colors"
            >
              Manage Inventory →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-rose-200/80 p-4 rounded-2xl flex items-center justify-between shadow-2xs hover:border-rose-300 transition-all"
              >
                <div>
                  <p className="text-xs font-bold text-[#0C134F]">{item.product?.name || item.variantSku}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">SKU: {item.variantSku}</p>
                </div>
                <div className="text-right">
                  <Badge variant="error" size="sm" className="font-mono font-bold">
                    {item.quantity} left
                  </Badge>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    Threshold: {item.lowStockThreshold ?? 5}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
