"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminCustomer } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TableActionButton, TableActionGroup } from "@/components/admin/TableAction";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
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
              className="font-semibold text-xs text-[#0C134F] hover:text-[#590B16] transition-colors"
            >
              {displayName}
            </Link>
            <p className="text-[11px] text-slate-500 font-mono tracking-tight">{row.email}</p>
          </div>
        );
      },
    },
    {
      header: "Phone",
      cell: (row) => (
        <span className="text-xs text-slate-500 font-mono tracking-tight">{row.phone || "—"}</span>
      ),
    },
    {
      header: "Joined",
      cell: (row) => (
        <span className="text-xs text-slate-600 font-sans">{formatDate(row.createdAt)}</span>
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
        <TableActionGroup>
          <TableActionButton
            variant="outline"
            href={`/admin/customers/${row._id}`}
          >
            Details
          </TableActionButton>

          {hasPermission("customers.update") && (
            <TableActionButton
              variant={row.status === "active" ? "destructive" : "success"}
              onClick={() => handleStatusToggle(row)}
            >
              {row.status === "active" ? "Block" : "Unblock"}
            </TableActionButton>
          )}
        </TableActionGroup>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="CLIENTS & ACCOUNTS"
        title="Customer Directory"
        description="Comprehensive list of registered patrons, shipping profiles, and account statuses."
        count={totalCount}
        breadcrumbs={[{ label: "Customers" }]}
      />

      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 text-status-error text-xs font-medium">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <AdminFilterBar
        hasActiveFilters={Boolean(search)}
        resetLabel="RESET SEARCH"
        onReset={() => {
          setSearch("");
          setPage(1);
        }}
      >
        <Input
          placeholder="Search customers by name, email..."
          value={search}
          leftIcon={<Icons.Search size={15} className="text-[#64748B]" />}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full text-xs"
        />
      </AdminFilterBar>

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
