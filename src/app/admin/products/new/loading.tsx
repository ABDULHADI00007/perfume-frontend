import React from "react";
import { AdminDetailSkeleton } from "@/components/admin/AdminDetailSkeleton";

export default function AdminNewProductLoading() {
  return <AdminDetailSkeleton category="CATALOG CREATION" hasSidebar={true} />;
}
