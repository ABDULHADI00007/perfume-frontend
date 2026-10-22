"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminProduct } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/features/admin/products/ProductForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Icons } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils";

export default function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const { hasPermission } = useAdminAuth();

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await adminService.getProductById(productId);
        setProduct(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }

    if (hasPermission("products.read")) {
      loadProduct();
    }
  }, [productId, hasPermission]);

  if (!hasPermission("products.update")) {
    return <AdminAccessDenied requiredPermission="products.update" />;
  }

  if (isLoading) {
    return (
      <div className="py-24 text-center font-sans">
        <Spinner size="lg" className="mx-auto mb-3 text-[#0C134F]" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
          Loading Fragrance Details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-md mx-auto my-16 font-sans shadow-sm">
        <Icons.AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3 opacity-80" />
        <p className="text-sm text-slate-600 mb-5">
          {error || "Product not found or has been removed."}
        </p>
        <Link href="/admin/products">
          <Button variant="outline" size="sm" className="gap-2">
            <Icons.ArrowLeft size={14} /> Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url;

  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? product.category.name
      : "Fragrance";

  return (
    <div className="space-y-6 font-sans pb-10">
      <AdminPageHeader
        category="CATALOG SPECIFICATION"
        title={product.name}
        description={`SKU: ${product.sku} • Category: ${categoryName}`}
        breadcrumbs={[
          { label: "Products", href: "/admin/products" },
          { label: product.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {product.slug && (
              <a
                href={`/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-slate-100 text-[#0C134F] hover:text-[#0C134F] border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium shadow-2xs gap-1.5 transition-all"
                >
                  <Icons.ExternalLink size={13} className="text-slate-400 group-hover:text-[#0C134F]" />
                  <span>View Storefront</span>
                </Button>
              </a>
            )}
            <Link href="/admin/products">
              <Button
                variant="outline"
                size="sm"
                className="bg-white hover:bg-slate-100 text-[#0C134F] hover:text-[#0C134F] border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium shadow-2xs gap-1.5 transition-all"
              >
                <Icons.ArrowLeft size={13} className="text-slate-400" />
                <span>Back to Catalog</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Product Hero Header Summary Card - 21st.dev Luxury Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(12,19,79,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#0C134F]/5 via-transparent to-transparent pointer-events-none rounded-full blur-2xl" />
        <div className="relative flex items-start sm:items-center gap-5">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-sm ring-4 ring-slate-100">
            {primaryImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Icons.Package size={28} className="text-slate-400" />
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-sans text-xl sm:text-2xl text-[#0C134F] font-bold tracking-tight">
                {product.name}
              </h2>
              <StatusBadge status={product.status || "active"} />
            </div>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-500 font-sans">
              <span className="font-mono text-slate-400 bg-slate-100/70 px-2 py-0.5 rounded-md border border-slate-200/60">
                SKU: {product.sku}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-medium bg-[#0C134F]/5 text-[#0C134F] px-2.5 py-0.5 rounded-md border border-[#0C134F]/15 font-sans">
                {categoryName}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-mono font-bold text-base text-[#0C134F] tabular-nums">
                {formatCurrency(product.price, product.currency || "USD")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Product Edit Form */}
      <ProductForm initialProduct={product} isEdit={true} />
    </div>
  );
}
