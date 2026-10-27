import React from "react";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";

export default function AdminProductsLoading() {
  return (
    <AdminTableSkeleton
      category="STORE OPERATIONS"
      title="Fragrance Catalog"
      hasFilters={true}
      rows={8}
    />
  );
}
