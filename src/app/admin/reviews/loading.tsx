import React from "react";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";

export default function AdminReviewsLoading() {
  return (
    <AdminTableSkeleton
      category="CLIENT FEEDBACK"
      title="Fragrance Reviews"
      hasFilters={true}
      rows={7}
    />
  );
}
