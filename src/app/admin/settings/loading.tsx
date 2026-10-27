import React from "react";
import { AdminDetailSkeleton } from "@/components/admin/AdminDetailSkeleton";

export default function AdminSettingsLoading() {
  return <AdminDetailSkeleton category="SYSTEM & OPERATIONS" hasSidebar={false} />;
}
