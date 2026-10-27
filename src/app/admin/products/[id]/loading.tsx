import React from "react";
import { AdminDetailSkeleton } from "@/components/admin/AdminDetailSkeleton";

export default function AdminProductDetailLoading() {
  return <AdminDetailSkeleton category="PRODUCT FORMULATION" hasSidebar={true} />;
}
