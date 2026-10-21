"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminProduct, AdminCategory } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { TableActionButton, TableActionGroup } from "@/components/admin/TableAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Icons } from "@/components/ui/icons";
import { formatCurrency, cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const { hasPermission } = useAdminAuth();
  const initialCachedCat = adminService.getCachedCategories();
  const initialCachedProd = adminService.getCachedProducts({ page: 1, limit: 10 });

  const [products, setProducts] = useState<AdminProduct[]>(initialCachedProd?.products || []);
  const [categories, setCategories] = useState<AdminCategory[]>(initialCachedCat || []);
  const [isLoading, setIsLoading] = useState(!initialCachedProd);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialCachedProd?.meta?.totalPages || 1);
  const [totalCount, setTotalCount] = useState(initialCachedProd?.meta?.total || initialCachedProd?.products.length || 0);

  // Archive / Delete State
  const [productToArchive, setProductToArchive] = useState<AdminProduct | null>(null);
  const [isArchiveLoading, setIsArchiveLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await adminService.getCategories();
      setCategories(cats);
    } catch {
      // Best effort categories load
    }
  }, []);

  const fetchProducts = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setIsLoading(true);
      setError(null);
      const res = await adminService.getProducts({
        page,
        limit: 10,
        search: search.trim() || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
      });
      setProducts(res.products);
      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
        setTotalCount(res.meta.total || res.products.length);
      }
    } catch (err: unknown) {
      if (!isSilent) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, search, categoryFilter, statusFilter]);

  useEffect(() => {
    if (hasPermission("products.read")) {
      const hasCache = Boolean(adminService.getCachedProducts({ page, limit: 10, search: search.trim() || undefined, category: categoryFilter || undefined, status: statusFilter || undefined }));
      fetchCategories();
      fetchProducts(hasCache);
    }
  }, [fetchCategories, fetchProducts, hasPermission, page, search, categoryFilter, statusFilter]);

  if (!hasPermission("products.read")) {
    return <AdminAccessDenied requiredPermission="products.read" />;
  }

  const handleConfirmArchive = async () => {
    if (!productToArchive) return;
    try {
      setIsArchiveLoading(true);
      await adminService.archiveProduct(productToArchive._id);
      setProductToArchive(null);
      fetchProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to archive product");
    } finally {
      setIsArchiveLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setIsLoading(true);
      await adminService.restoreProduct(id);
      fetchProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to restore product");
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<AdminProduct>[] = [
    {
      header: "Fragrance",
      cell: (row) => {
        const primaryImg = row.images?.find((i) => i.isPrimary) || row.images?.[0];
        return (
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
              {primaryImg?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={primaryImg.url}
                  alt={row.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <Icons.Package size={18} className="text-slate-400" />
              )}
            </div>
            <div>
              <Link
                href={`/admin/products/${row._id}`}
                className="font-semibold text-xs text-[#0C134F] hover:text-[#590B16] transition-colors block leading-snug"
              >
                {row.name}
              </Link>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10.5px] text-slate-500 font-mono tracking-tight">
                  {row.sku}
                </span>
                {row.fragrance?.concentration && (
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 bg-slate-100/90 text-slate-600 rounded-md border border-slate-200/60">
                    {row.fragrance.concentration}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Category",
      cell: (row) => {
        const catName =
          typeof row.category === "object" && row.category !== null
            ? row.category.name
            : categories.find((c) => c._id === row.category)?.name || "—";
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-[#FAF7EE] text-[#590B16] border border-[#590B16]/20 tracking-wide shadow-2xs">
            {catName}
          </span>
        );
      },
    },
    {
      header: "Price",
      cell: (row) => (
        <div className="space-y-0.5">
          <span className="font-bold text-xs font-mono text-[#0C134F] tabular-nums">
            {formatCurrency(row.price, row.currency || "USD")}
          </span>
          {row.compareAtPrice ? (
            <span className="block text-[10.5px] text-slate-400 line-through font-mono tabular-nums">
              {formatCurrency(row.compareAtPrice, row.currency || "USD")}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      header: "Stock Level",
      cell: (row) => {
        const totalStock = row.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 0;
        const isLow = totalStock > 0 && totalStock <= 10;
        const isOut = totalStock <= 0;

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isOut
                    ? "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]"
                    : isLow
                    ? "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]"
                    : "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                )}
              />
              <span className="text-xs font-semibold text-[#0C134F] tabular-nums">
                {totalStock} units
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              {row.variants?.length || 0} variant(s)
            </span>
          </div>
        );
      },
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      align: "right",
      cell: (row) => (
        <TableActionGroup>
          {hasPermission("products.update") && (
            <TableActionButton
              variant="outline"
              href={`/admin/products/${row._id}`}
            >
              Edit
            </TableActionButton>
          )}

          {hasPermission("products.archive") && row.status !== "archived" && (
            <TableActionButton
              variant="destructive"
              onClick={() => setProductToArchive(row)}
            >
              Archive
            </TableActionButton>
          )}

          {hasPermission("products.update") && row.status === "archived" && (
            <TableActionButton
              variant="success"
              onClick={() => handleRestore(row._id)}
            >
              Restore
            </TableActionButton>
          )}
        </TableActionGroup>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="STORE OPERATIONS"
        title="Fragrance Catalog"
        description="Curate perfume formulations, variant inventory, pricing models, and olfactory pyramids."
        count={totalCount}
        breadcrumbs={[{ label: "Products" }]}
        actions={
          hasPermission("products.create") && (
            <Link href="/admin/products/new">
              <Button
                variant="primary"
                size="sm"
                className="bg-[#0C134F] hover:bg-[#121A4B] text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
              >
                <Icons.Plus size={14} />
                <span>Add Fragrance</span>
              </Button>
            </Link>
          )
        }
      />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-2xl shadow-2xs">
          {error}
        </div>
      )}

      {/* 21st.dev Filter Bar */}
      <AdminFilterBar
        hasActiveFilters={Boolean(search || categoryFilter || statusFilter)}
        resetLabel="CLEAR"
        onReset={() => {
          setSearch("");
          setCategoryFilter("");
          setStatusFilter("");
          setPage(1);
        }}
      >
        <Input
          placeholder="Search fragrance by name or SKU..."
          value={search}
          leftIcon={<Icons.Search size={15} className="text-slate-400" />}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full text-xs"
        />

        <Select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          options={[
            { label: "All Categories", value: "" },
            ...categories.map((c) => ({ label: c.name, value: c._id })),
          ]}
        />

        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          options={[
            { label: "All Statuses", value: "" },
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived" },
          ]}
        />
      </AdminFilterBar>

      {/* 21st.dev Products Table */}
      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        emptyMessage="No perfumes match the applied catalog filters."
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

      {/* Archive Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(productToArchive)}
        onClose={() => setProductToArchive(null)}
        onConfirm={handleConfirmArchive}
        title="Archive Fragrance"
        message={`Are you sure you want to archive "${productToArchive?.name}"? It will be safely removed from customer storefront listings.`}
        confirmLabel="Archive"
        isDestructive
        isLoading={isArchiveLoading}
      />
    </div>
  );
}
