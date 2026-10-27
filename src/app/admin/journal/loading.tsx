import React from "react";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";

export default function AdminJournalLoading() {
  return (
    <AdminTableSkeleton
      category="EDITORIAL & STORIES"
      title="Journal Stories"
      hasFilters={false}
      rows={6}
    />
  );
}
