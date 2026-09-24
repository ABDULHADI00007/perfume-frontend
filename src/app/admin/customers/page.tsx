"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminCustomer } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { formatDate } from "@/lib/utils";


export default function AdminCustomersPage() {
  const { hasPermission } = useAdminAuth();
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminService.getCustomers({
        page,
        limit: 10,
        search: search.trim() || undefined,
      });
      setCustomers(res.customers);
      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
        setTotalCount(res.meta.total || res.customers.length);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (hasPermission("customers.read")) {
      fetchCustomers();
    }
  }, [fetchCustomers, hasPermission]);

  if (!hasPermission("customers.read")) {
    return <AdminAccessDenied requiredPermission="customers.read" />;
  }

  const handleStatusToggle = async (customer: AdminCustomer) => {
    const nextStatus = customer.status === "active" ? "blocked" : "active";
    try {
      await adminService.updateCustomerStatus(customer._id, nextStatus);
      fetchCustomers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update customer status");
    }
  };

  const columns: Column<AdminCustomer>[] = [
    {
      header: "Customer",
      cell: (row) => {
        const displayName =
          row.name || (row.firstName ? `${row.firstName} ${row.lastName || ""}` : "Guest Customer");
        return (
          <div>
            <Link
              href={`/admin/customers/${row._id}`}
              className="font-medium text-xs text-foreground hover:underline"
            >
              {displayName}
            </Link>
            <p className="text-[11px] text-foreground-muted">{row.email}</p>
          </div>
        );
      },
    },
    {
      header: "Phone",
      cell: (row) => (
        <span className="text-xs text-foreground-muted font-mono">{row.phone || "—"}</span>
      ),
    },
    {
      header: "Joined",
      cell: (row) => (
        <span className="text-xs text-foreground-muted">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status || "active"} />,
    },
    {
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link href={`/admin/customers/${row._id}`}>
            <Button variant="ghost" size="sm">
              Details
            </Button>
          </Link>

          {hasPermission("customers.update") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusToggle(row)}
              className={row.status === "active" ? "text-status-error" : "text-status-success"}
            >
              {row.status === "active" ? "Block" : "Unblock"}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-medium block">
            Clients & Accounts
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
            Customers
          </h1>
        </div>

        <div className="text-xs text-foreground-muted">
          Total registered: <span className="font-semibold text-foreground">{totalCount}</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 text-status-error text-xs font-medium">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-surface p-4 border border-border flex items-center gap-3">
        <Input
          placeholder="Search by name, email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="text-xs max-w-md"
        />

        <Button
          variant="outline"
          size="md"
          onClick={() => {
            setSearch("");
            setPage(1);
          }}
        >
          Reset Search
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        emptyMessage="No customer records found."
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
    </div>
  );
}
