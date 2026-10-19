"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminProduct } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { ProductForm } from "@/features/admin/products/ProductForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Package,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Tag,
  Sparkles,
} from "lucide-react";

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
        <Spinner size="lg" className="mx-auto mb-3 text-foreground-muted" />
        <p className="text-xs font-semibold text-foreground-muted uppercase tracking-[0.2em]">
          Loading Fragrance Details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center max-w-md mx-auto my-16 font-sans shadow-sm">
        <AlertCircle className="w-10 h-10 text-status-error mx-auto mb-3 opacity-80" />
        <p className="text-sm text-foreground-muted mb-5">
          {error || "Product not found or has been removed."}
        </p>
        <Link href="/admin/products">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Products
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
      {/* Top Breadcrumbs & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center space-x-2 text-xs text-foreground-muted">
          <Link
            href="/admin/products"
            className="hover:text-foreground transition-colors font-medium"
          >
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-foreground-muted/60" />
          <span className="text-foreground font-semibold">{product.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {product.slug && (
            <a
              href={`/products/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-xs h-9 font-medium text-foreground-muted hover:text-foreground"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View on Storefront
              </Button>
            </a>
          )}
          <Link href="/admin/products">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs h-9 font-medium shadow-xs border-border hover:bg-surface-subtle"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Hero Profile Header Card */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-surface-subtle border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            {primaryImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-7 h-7 text-foreground-muted" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal tracking-tight">
                {product.name}
              </h1>
              <StatusBadge status={product.status || "active"} />
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-foreground-muted mt-2">
              <div className="flex items-center gap-1.5 font-mono">
                <Tag className="w-3.5 h-3.5 text-foreground-muted/80" />
                <span>SKU: {product.sku}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-foreground-muted/80" />
                <span>{categoryName}</span>
              </div>
              <div className="font-semibold font-mono text-foreground text-sm">
                {formatCurrency(product.price, product.currency || "USD")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Product Edit Form */}
      <ProductForm initialProduct={product} isEdit={true} />
    </div>
  );
}

