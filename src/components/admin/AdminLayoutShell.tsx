"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminLoginForm } from "./AdminLoginForm";
import { Drawer } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

export const AdminLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FBF9F5]">
        <Spinner size="lg" className="text-[#0C134F] mb-4" />
        <p className="text-xs font-sans uppercase tracking-[0.2em] text-[#6B6F80]">
          Authenticating Soulmate Scents Portal...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FBF9F5] font-sans text-[#121735]">
      {/* Mobile Top Bar (only visible on mobile screens md:hidden) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#E6E2EA] sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-serif text-lg font-normal tracking-wide text-[#0C134F]">
            Soulmate Scents
          </span>
          <Badge variant="secondary" size="sm" className="font-mono text-[9px]">
            ADMIN
          </Badge>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          className="p-2 text-[#6B6F80] hover:text-[#121735] rounded-lg hover:bg-[#FBF9F5]"
        >
          <Icons.Menu size={20} />
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        position="left"
        title="Admin Menu"
      >
        <div className="-m-6 h-[calc(100vh-4rem)]">
          <AdminSidebar
            className="w-full border-r-0 max-h-full"
            onItemClick={() => setMobileMenuOpen(false)}
          />
        </div>
      </Drawer>

      {/* Main Administrative Workspace */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="w-full max-w-[1700px] mx-auto space-y-8">{children}</div>
      </main>
    </div>
  );
};
