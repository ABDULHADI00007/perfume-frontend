import React from "react";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";

export default function AdminCollectionsLoading() {
  return (
    <AdminTableSkeleton
      category="CURATION & EDITORIAL"
      title="Fragrance Collections"
      hasFilters={false}
      rows={6}
    />
  );
}
