import React from "react";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";

export default function AdminCategoriesLoading() {
  return (
    <AdminTableSkeleton
      category="TAXONOMY & FAMILIES"
      title="Fragrance Categories"
      hasFilters={false}
      rows={6}
    />
  );
}
