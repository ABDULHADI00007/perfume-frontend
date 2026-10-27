import React from "react";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";

export default function AdminOrdersLoading() {
  return (
    <AdminTableSkeleton
      category="FULFILLMENT & DISPATCH"
      title="Customer Orders"
      hasFilters={true}
      rows={8}
    />
  );
}
