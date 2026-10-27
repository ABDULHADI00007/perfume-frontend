import React from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { AdminAuthProvider } from "@/features/admin/context/AdminAuthContext";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export const metadata = constructMetadata({
  title: "Admin Dashboard | Soulmate Scents",
  description: "Administrative control panel for Soulmate Scents luxury fragrance house.",
  noIndex: true,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-admin-portal="true" className="font-sans antialiased text-slate-900 bg-[#F8F9FA]">
      <AdminAuthProvider>
        <AdminLayoutShell>{children}</AdminLayoutShell>
      </AdminAuthProvider>
    </div>
  );
}

