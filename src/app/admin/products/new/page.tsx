"use client";

import React from "react";
import Link from "next/link";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { ProductForm } from "@/features/admin/products/ProductForm";
import { Button } from "@/components/ui/button";

export default function AdminNewProductPage() {
  const { hasPermission } = useAdminAuth();

  if (!hasPermission("products.create")) {
    return <AdminAccessDenied requiredPermission="products.create" />;
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center space-x-2 text-xs text-foreground-muted">
          <Link href="/admin/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">New Fragrance</span>
        </div>

        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            ← Back to Products
          </Button>
        </Link>
      </div>

      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-medium block">
          Catalog Creation
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
          Add New Fragrance
        </h1>
      </div>

      <ProductForm isEdit={false} />
    </div>
  );
}
