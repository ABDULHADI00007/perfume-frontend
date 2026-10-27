import React from "react";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";

export default function AdminInventoryLoading() {
  return (
    <AdminTableSkeleton
      category="WAREHOUSE & STOCK"
      title="Stock Inventory"
      hasFilters={true}
      rows={8}
    />
  );
}
