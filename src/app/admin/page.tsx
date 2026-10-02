"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminOrder, AdminInventoryItem, DashboardOverviewStats } from "@/features/admin/types";
import { StatsCard } from "@/components/admin/StatsCard";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/ui/icons";
import { formatCurrency, formatDate } from "@/lib/utils";


export default function AdminDashboardPage() {
  const initialCachedStats = adminService.getCachedDashboard();
  const initialCachedOrders = adminService.getCachedOrders({ limit: 5 });

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
          adminService.getOrders({ limit: 5 }),
          adminService.getOrders({ paymentStatus: "pending_verification", limit: 5 }),
          adminService.getInventory({ lowStock: "true", limit: 5 }),
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
          setError(err instanceof Error ? err.message : "Failed to load dashboard");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const orderColumns: Column<AdminOrder>[] = [
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
          <p className="text-[11px] text-foreground-muted font-mono">{row.customer?.email}</p>
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
      header: "Payment",
      cell: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.orderStatus} />,
    },
    {
      header: "Total",
      align: "right",
      cell: (row) => (
        <span className="font-semibold text-xs font-mono">
          {formatCurrency(row.totalAmount, row.currency || "USD")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2DED6]/80 pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#8E95A2] font-sans font-semibold block mb-1">
            EXECUTIVE OVERVIEW
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0B1938] font-bold tracking-tight">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-[#FAF8F5] text-[#0B1938] border border-gray-200/80 rounded-xl px-5 py-2.5 text-[10px] font-bold tracking-[0.16em] uppercase shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              VIEW ORDERS
            </Button>
          </Link>

          <Link href="/admin/products/new">
            <Button
              variant="primary"
              size="sm"
              className="bg-[#0C134F] hover:bg-[#121A4B] text-white rounded-xl px-5 py-2.5 text-[10px] font-bold tracking-[0.16em] uppercase shadow-md hover:shadow-lg transition-all cursor-pointer gap-1.5"
            >
              <Icons.Plus size={14} />
              + ADD FRAGRANCE
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#FDF2F2] border border-[#9E2A2B]/20 text-[#9E2A2B] text-xs font-medium rounded-xl shadow-xs">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6 space-y-3 bg-white rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-200/80">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-40" />
            </Card>
          ))
        ) : (
          <>
            <StatsCard
              title="TOTAL REVENUE"
              value={formatCurrency(stats?.totalSales ?? 0)}
              icon={<Icons.Dollar size={18} />}
              description="Gross sales from completed orders"
            />
            <StatsCard
              title="TOTAL ORDERS"
              value={stats?.totalOrders ?? 0}
              icon={<Icons.Delivery size={18} />}
              description="Lifetime orders placed"
            />
            <StatsCard
              title="CUSTOMERS"
              value={stats?.totalCustomers ?? 0}
              icon={<Icons.User size={18} />}
              description="Registered & guest profiles"
            />
            <StatsCard
              title="CATALOG PRODUCTS"
              value={stats?.totalProducts ?? 0}
              icon={<Icons.Package size={18} />}
              description="Active and draft perfumes"
            />
          </>
        )}
      </div>

      {/* Pending Action Banners with Shadcn Card */}
      {pendingProofOrders.length > 0 && (
        <Card variant="bordered" className="border-[#F5EAD4] bg-[#FAF4E8] p-6 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#0B1938] text-white rounded-full flex-shrink-0 shadow-sm">
                <Icons.ShieldCheck size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-serif font-bold text-[#0B1938]">
                    Bank Transfer Proof Review Required
                  </h4>
                  <Badge variant="warning" size="sm" className="font-mono">
                    {pendingProofOrders.length} Pending
                  </Badge>
                </div>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Customers have uploaded wire transfer receipts requiring manual verification before fulfillment.
                </p>
              </div>
            </div>
            <Link href={`/admin/orders/${pendingProofOrders[0]._id}`}>
              <Button variant="outline" size="sm" className="whitespace-nowrap rounded-xl bg-white border-[#E2DED6]">
                Review Proofs
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Recent Orders Section with Elevated Checkout Form Card Styling */}
      <div className="bg-white rounded-[24px] border-0 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-7 pb-5 border-b border-[#EFECE6] gap-2">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0B1938] uppercase tracking-wider">
              Recent Orders
            </h2>
            <p className="text-xs text-[#64748B] font-sans mt-0.5">
              Latest transactions placed on the storefront
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#0B1938] hover:text-[#926618] underline underline-offset-4 transition-colors"
          >
            <span>View all orders</span>
            <span>→</span>
          </Link>
        </div>
        <div>
          <DataTable
            columns={orderColumns}
            data={recentOrders}
            emptyMessage="No orders have been placed yet."
          />
        </div>
      </div>

      {/* Low Stock Alerts with Shadcn Card */}
      {lowStockItems.length > 0 && (
        <Card variant="default">
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-status-error animate-ping" />
              <CardTitle className="text-xs uppercase tracking-[0.18em] font-semibold text-status-error font-mono flex items-center gap-1.5">
                <Icons.Tag size={14} />
                Low Stock Inventory Alerts
              </CardTitle>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs text-foreground-muted hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Manage inventory →
            </Link>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.map((item) => (
                <div
                  key={item._id}
                  className="border border-border/80 bg-surface-subtle/50 p-4 rounded-xl flex items-center justify-between hover:border-status-error/40 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.product?.name || item.variantSku}</p>
                    <p className="text-[11px] text-foreground-muted font-mono mt-0.5">SKU: {item.variantSku}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="error" size="sm" className="font-mono font-bold">
                      {item.quantity} left
                    </Badge>
                    <p className="text-[10px] text-foreground-subtle mt-1 font-mono">
                      Min: {item.lowStockThreshold ?? 5}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
