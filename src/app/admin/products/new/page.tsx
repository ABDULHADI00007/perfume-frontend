"use client";

import React from "react";
import Link from "next/link";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/features/admin/products/ProductForm";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export default function AdminNewProductPage() {
  const { hasPermission } = useAdminAuth();

  if (!hasPermission("products.create")) {
    return <AdminAccessDenied requiredPermission="products.create" />;
  }

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="STORE MANAGEMENT"
        title="Add New Fragrance"
        description="Craft an exquisite perfume profile with olfactory pyramid, bottle variants, and visual presentation."
        breadcrumbs={[
          { label: "Products", href: "/admin/products" },
          { label: "New Fragrance" },
        ]}
        actions={
          <Link href="/admin/products">
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-slate-50 text-[#0C134F] border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold shadow-2xs gap-1.5"
            >
              <Icons.ArrowLeft size={14} />
              <span>Back to Catalog</span>
            </Button>
          </Link>
        }
      />

      <ProductForm isEdit={false} />
    </div>
  );
}
