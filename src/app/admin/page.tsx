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
          adminService.getDashboardOverview(),
          adminService.getOrders({ limit: 6 }),
          adminService.getOrders({ paymentStatus: "pending_verification", limit: 5 }),
          adminService.getInventory({ lowStock: "true", limit: 6 }),
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
          <p className="font-semibold text-xs text-[#0C134F]">{row.customer?.name || "Guest Customer"}</p>
          <p className="text-[11px] text-slate-500 font-mono tracking-tight">{row.customer?.email}</p>
        </div>
      ),
    },
    {
      header: "Placed At",
      cell: (row) => (
        <span className="text-xs text-slate-600 font-sans">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      header: "Payment",
      cell: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
      header: "Fulfillment",
      cell: (row) => <StatusBadge status={row.orderStatus} />,
    },
    {
      header: "Total Value",
      align: "right",
      cell: (row) => (
        <span className="font-bold text-xs font-mono text-[#0C134F] tabular-nums">
          {formatCurrency(row.totalAmount, row.currency || "USD")}
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
    <div className="space-y-8 font-sans">
      {/* 21st.dev Executive Header */}
      <AdminPageHeader
        category="EXECUTIVE OVERVIEW"
        title="Command Center"
        description="Comprehensive real-time telemetry, transaction flows, and catalog metrics for Soulmate Scents."
        actions={
          <div className="flex items-center gap-2.5">
            <Link href="/admin/orders">
              <Button
                variant="outline"
                size="sm"
                className="bg-white hover:bg-slate-50 text-[#0C134F] border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold shadow-2xs cursor-pointer"
              >
                All Orders
              </Button>
            </Link>

            <Link href="/admin/products/new">
              <Button
                variant="primary"
                size="sm"
                className="bg-[#0C134F] hover:bg-[#121A4B] text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
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

      {/* 21st.dev Metrics KPI Grid */}
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
              title="Gross Sales"
              value={formatCurrency(stats?.totalSales ?? 0)}
              icon={<Icons.Dollar size={18} />}
              change="+14.2%"
              changeType="positive"
              trendLabel="vs last 30 days"
            />
            <StatsCard
              title="Total Orders"
              value={stats?.totalOrders ?? 0}
              icon={<Icons.Delivery size={18} />}
              change="+8.5%"
              changeType="positive"
              trendLabel="active & fulfilled"
            />
            <StatsCard
              title="Verified Customers"
              value={stats?.totalCustomers ?? 0}
              icon={<Icons.User size={18} />}
              change="+12"
              changeType="positive"
              trendLabel="registered accounts"
            />
            <StatsCard
              title="Perfume Catalog"
              value={stats?.totalProducts ?? 0}
              icon={<Icons.Package size={18} />}
              changeType="neutral"
              trendLabel="active collections"
            />
          </>
        )}
      </div>

      {/* Pending Action Banner: Wire Transfer Review Required */}
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
                    Bank Wire Proofs Awaiting Verification
                  </h4>
                  <Badge variant="warning" size="sm" className="font-mono text-[10px]">
                    {pendingProofOrders.length} Pending
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Customers have submitted payment slips for bank transfers that need verification before dispatch.
                </p>
              </div>
            </div>
            <Link href={`/admin/orders/${pendingProofOrders[0]._id}`}>
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap rounded-xl bg-white border-amber-200 text-[#0C134F] hover:bg-amber-100/50 shadow-2xs"
              >
                Review Proofs
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Operational Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/admin/products"
          className="p-4 bg-white rounded-2xl border border-slate-200/70 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-200 group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0C134F] group-hover:bg-[#0C134F] group-hover:text-white transition-all">
              <Icons.Package size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0C134F]">Fragrances</p>
              <p className="text-[10px] text-slate-400">Manage catalog</p>
            </div>
          </div>
          <Icons.ChevronRight size={14} className="text-slate-300 group-hover:text-[#0C134F] transition-colors" />
        </Link>

        <Link
          href="/admin/inventory"
          className="p-4 bg-white rounded-2xl border border-slate-200/70 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-200 group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0C134F] group-hover:bg-[#0C134F] group-hover:text-white transition-all">
              <Icons.ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0C134F]">Inventory</p>
              <p className="text-[10px] text-slate-400">Stock controls</p>
            </div>
          </div>
          <Icons.ChevronRight size={14} className="text-slate-300 group-hover:text-[#0C134F] transition-colors" />
        </Link>

        <Link
          href="/admin/reviews"
          className="p-4 bg-white rounded-2xl border border-slate-200/70 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-200 group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0C134F] group-hover:bg-[#0C134F] group-hover:text-white transition-all">
              <Icons.Star size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0C134F]">Reviews</p>
              <p className="text-[10px] text-slate-400">Customer feedback</p>
            </div>
          </div>
          <Icons.ChevronRight size={14} className="text-slate-300 group-hover:text-[#0C134F] transition-colors" />
        </Link>

        <Link
          href="/admin/settings"
          className="p-4 bg-white rounded-2xl border border-slate-200/70 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-200 group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0C134F] group-hover:bg-[#0C134F] group-hover:text-white transition-all">
              <Icons.Settings size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0C134F]">Settings</p>
              <p className="text-[10px] text-slate-400">Banking & store</p>
            </div>
          </div>
          <Icons.ChevronRight size={14} className="text-slate-300 group-hover:text-[#0C134F] transition-colors" />
        </Link>
      </div>

      {/* Recent Orders Section with Elevated 21st.dev Card */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#0C134F]">
              Recent Orders
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Live transactions and customer acquisitions
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0C134F] hover:text-[#926618] transition-colors"
          >
            <span>View All</span>
            <Icons.ChevronRight size={14} />
          </Link>
        </div>

        <DataTable
          columns={orderColumns}
          data={recentOrders}
          emptyMessage="No orders have been recorded yet."
        />
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <h3 className="font-display text-base font-bold text-[#0C134F]">
                Critical Inventory Alerts
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
