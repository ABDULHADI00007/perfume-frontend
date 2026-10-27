import React from "react";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";

export default function AdminNewsletterLoading() {
  return (
    <AdminTableSkeleton
      category="MARKETING & AUDIENCE"
      title="Newsletter Subscribers"
      hasFilters={false}
      rows={7}
    />
  );
}
