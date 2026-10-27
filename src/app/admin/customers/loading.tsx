import React from "react";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";

export default function AdminCustomersLoading() {
  return (
    <AdminTableSkeleton
      category="CLIENT RELATIONS"
      title="Customer Accounts"
      hasFilters={true}
      rows={8}
    />
  );
}
