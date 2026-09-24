"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminProduct } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { ProductForm } from "@/features/admin/products/ProductForm";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
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
      <div className="py-20 text-center font-sans">
        <Spinner size="lg" className="mx-auto mb-3 text-foreground-muted" />
        <p className="text-xs text-foreground-muted uppercase tracking-wider">Loading Fragrance Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-surface border border-border p-8 text-center max-w-md mx-auto my-12 font-sans">
        <p className="text-sm text-foreground-muted mb-4">{error || "Product not found."}</p>
        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center space-x-2 text-xs text-foreground-muted">
          <Link href="/admin/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </div>

        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            ← Back to Products
          </Button>
        </Link>
      </div>

      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-medium block">
          Catalog Editing
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
          Edit {product.name}
        </h1>
      </div>

      <ProductForm initialProduct={product} isEdit={true} />
    </div>
  );
}
