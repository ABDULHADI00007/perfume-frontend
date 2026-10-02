"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminProduct, AdminCategory } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Icons } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils";


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
      header: "Product",
      cell: (row) => {
        const primaryImg = row.images?.find((i) => i.isPrimary) || row.images?.[0];
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-surface-subtle border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
              {primaryImg?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={primaryImg.url}
                  alt={row.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icons.Package size={16} className="text-foreground-muted" />
              )}
            </div>
            <div>
              <Link
                href={`/admin/products/${row._id}`}
                className="font-medium text-xs text-foreground hover:underline"
              >
                {row.name}
              </Link>
              <p className="text-[11px] text-foreground-muted font-mono">{row.sku}</p>
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
        return <span className="text-xs text-foreground-muted">{catName}</span>;
      },
    },
    {
      header: "Price",
      cell: (row) => (
        <div>
          <span className="font-medium text-xs font-mono">
            {formatCurrency(row.price, row.currency || "USD")}
          </span>
          {row.compareAtPrice ? (
            <span className="text-[10px] text-foreground-subtle line-through ml-1.5 font-mono">
              {formatCurrency(row.compareAtPrice, row.currency || "USD")}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      header: "Variants / Stock",
      cell: (row) => {
        const totalStock = row.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 0;
        return (
          <span className="text-xs text-foreground-muted">
            {row.variants?.length || 0} variant(s) • {totalStock} in stock
          </span>
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
        <div className="flex items-center justify-end gap-1.5">
          {hasPermission("products.update") && (
            <Link href={`/admin/products/${row._id}`}>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </Link>
          )}

          {hasPermission("products.archive") && row.status !== "archived" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setProductToArchive(row)}
              className="text-status-error hover:bg-status-error/10"
            >
              Archive
            </Button>
          )}

          {hasPermission("products.update") && row.status === "archived" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRestore(row._id)}
              className="text-status-success hover:bg-status-success/10"
            >
              Restore
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
            Catalog Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
            Products
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-foreground-muted mr-2">
            Total products: <span className="font-semibold text-foreground">{totalCount}</span>
          </div>

          {hasPermission("products.create") && (
            <Link href="/admin/products/new">
              <Button variant="primary" size="sm">
                <Icons.Plus size={14} className="mr-1.5" />
                Add Product
              </Button>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 text-status-error text-xs font-medium">
          {error}
        </div>
      )}

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-surface p-4 border border-border">
        <Input
          placeholder="Search by name, SKU..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="text-xs"
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

        <Button
          variant="outline"
          size="md"
          onClick={() => {
            setSearch("");
            setCategoryFilter("");
            setStatusFilter("");
            setPage(1);
          }}
        >
          Reset Filters
        </Button>
      </div>

      {/* Products Table */}
      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        emptyMessage="No products found matching the criteria."
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
        title="Archive Product"
        message={`Are you sure you want to archive "${productToArchive?.name}"? It will be removed from active storefront catalog.`}
        confirmLabel="Archive"
        isDestructive
        isLoading={isArchiveLoading}
      />
    </div>
  );
}
