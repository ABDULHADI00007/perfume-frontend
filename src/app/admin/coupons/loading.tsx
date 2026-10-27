import React from "react";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";

export default function AdminCouponsLoading() {
  return (
    <AdminTableSkeleton
      category="PROMOTIONS & PRIVILEGES"
      title="Promotional Coupons"
      hasFilters={false}
      rows={6}
    />
  );
}
