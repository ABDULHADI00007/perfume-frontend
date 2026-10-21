"use client";

import React, { useState } from "react";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminLoginForm } from "./AdminLoginForm";
import { Drawer } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";

export const AdminLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8F9FA]">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200/80 flex flex-col items-center space-y-3">
          <Spinner size="lg" className="text-[#0C134F]" />
          <p className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-slate-500">
            Soulmate Scents Admin
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FA] font-sans text-slate-900 selection:bg-[#D4ADFC]/30 selection:text-[#0C134F]">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 shrink-0 z-30">
        <AdminSidebar />
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        position="left"
        title="Admin Navigation"
      >
        <div className="-m-6 h-[calc(100vh-4rem)]">
          <AdminSidebar
            className="w-full border-r-0 max-h-full"
            onItemClick={() => setMobileMenuOpen(false)}
          />
        </div>
      </Drawer>

      {/* Main Administrative Area with Top Header */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminHeader onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-[1700px] mx-auto space-y-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
