import React from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { AdminAuthProvider } from "@/features/admin/context/AdminAuthContext";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export const metadata = constructMetadata({
  title: "Admin Dashboard | Maison de Parfum",
  description: "Administrative control panel for Maison de Parfum luxury fragrance house.",
  noIndex: true,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AdminAuthProvider>
  );
}

