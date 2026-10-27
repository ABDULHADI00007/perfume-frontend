import React from "react";
import { AdminDetailSkeleton } from "@/components/admin/AdminDetailSkeleton";

export default function AdminOrderDetailLoading() {
  return <AdminDetailSkeleton category="FULFILLMENT & DISPATCH" hasSidebar={true} />;
}
