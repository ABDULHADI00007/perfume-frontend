"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminOrder, AdminInventoryItem, DashboardOverviewStats } from "@/features/admin/types";
import { StatsCard } from "@/components/admin/StatsCard";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency, formatDate } from "@/lib/utils";



export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardOverviewStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [pendingProofOrders, setPendingProofOrders] = useState<AdminOrder[]>([]);
  const [lowStockItems, setLowStockItems] = useState<AdminInventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
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
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
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
        <span className="font-medium text-xs">
          {formatCurrency(row.totalAmount, row.currency || "USD")}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <Spinner size="lg" className="mx-auto mb-3 text-foreground-muted" />
        <p className="text-xs text-foreground-muted uppercase tracking-wider">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-medium block">
            Executive Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              <Icons.Delivery size={14} className="mr-1.5" />
              Orders
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm">
              <Icons.Plus size={14} className="mr-1.5" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 text-status-error text-xs font-medium">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalSales ?? 0)}
          icon={<Icons.Dollar size={20} />}
          description="Gross sales from completed orders"
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders ?? 0}
          icon={<Icons.Delivery size={20} />}
          description="Lifetime orders placed"
        />
        <StatsCard
          title="Customers"
          value={stats?.totalCustomers ?? 0}
          icon={<Icons.User size={20} />}
          description="Registered & guest profiles"
        />
        <StatsCard
          title="Catalog Products"
          value={stats?.totalProducts ?? 0}
          icon={<Icons.Package size={20} />}
          description="Active and draft perfumes"
        />
      </div>

      {/* Pending Action Banners if any */}
      {pendingProofOrders.length > 0 && (
        <div className="border border-status-warning/30 bg-status-warning/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-status-warning/10 text-status-warning rounded-none mt-0.5">
              <Icons.ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {pendingProofOrders.length} Bank Transfer Payment Proof{pendingProofOrders.length > 1 ? "s" : ""} Pending Review
              </h4>
              <p className="text-xs text-foreground-muted mt-0.5">
                Customers have uploaded payment receipts requiring admin verification.
              </p>
            </div>
          </div>
          <Link href={`/admin/orders/${pendingProofOrders[0]._id}`}>
            <Button variant="outline" size="sm">
              Review Proofs
            </Button>
          </Link>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs text-foreground-muted hover:text-foreground underline underline-offset-4"
          >
            View all orders →
          </Link>
        </div>

        <DataTable
          columns={orderColumns}
          data={recentOrders}
          emptyMessage="No orders have been placed yet."
        />
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-[0.16em] font-semibold text-status-error flex items-center gap-1.5">
              <Icons.Tag size={14} />
              Low Stock Inventory Alerts
            </h2>
            <Link
              href="/admin/inventory"
              className="text-xs text-foreground-muted hover:text-foreground underline underline-offset-4"
            >
              Manage inventory →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((item) => (
              <div
                key={item._id}
                className="border border-border bg-surface p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-foreground">{item.product?.name || item.variantSku}</p>
                  <p className="text-[11px] text-foreground-muted">SKU: {item.variantSku}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-status-error font-mono">
                    {item.quantity} units left
                  </span>
                  <p className="text-[10px] text-foreground-subtle">
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
