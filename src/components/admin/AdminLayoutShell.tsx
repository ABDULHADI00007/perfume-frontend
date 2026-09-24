"use client";

import React, { useState } from "react";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { AdminLoginForm } from "./AdminLoginForm";
import { Drawer } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";

export const AdminLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-surface-subtle">
        <Spinner size="lg" className="text-foreground-muted mb-4" />
        <p className="text-xs font-sans uppercase tracking-widest text-foreground-muted">
          Authenticating Admin Portal...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-subtle font-sans text-foreground">
      <AdminHeader onToggleMobileMenu={() => setMobileMenuOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Persistent Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        {/* Mobile Navigation Drawer */}
        <Drawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          position="left"
          title="Admin Menu"
        >
          <div className="-m-6">
            <AdminSidebar
              className="w-full border-r-0 min-h-0"
              onItemClick={() => setMobileMenuOpen(false)}
            />
          </div>
        </Drawer>

        {/* Main Administrative Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
