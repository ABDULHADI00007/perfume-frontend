"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { useAdminNotification } from "@/features/admin/context/AdminNotificationContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminLoginForm } from "./AdminLoginForm";
import { AdminAppShellSkeleton } from "./AdminAppShellSkeleton";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils";

export const AdminLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { newOrderAlert, dismissAlert } = useAdminNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return <AdminAppShellSkeleton />;
  }

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8F9FA] font-sans text-slate-900 selection:bg-[#D4ADFC]/30 selection:text-[#0C134F] relative">
      {/* Realtime New Order Notification Toast Banner */}
      {newOrderAlert && (
        <aside
          aria-label="New Order Notification"
          className="fixed top-5 right-5 z-50 max-w-sm w-[calc(100%-2.5rem)] sm:w-96 bg-white border-2 border-[#0C134F]/30 rounded-2xl shadow-2xl p-4 font-sans animate-in slide-in-from-top-4 fade-in duration-300 ring-4 ring-[#0C134F]/10"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0C134F] text-[#E5C38B] flex items-center justify-center shrink-0 shadow-md">
              <Icons.Bell size={18} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  🔔 New Order Received!
                </span>
                <button
                  type="button"
                  onClick={dismissAlert}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                  title="Dismiss notification"
                >
                  ✕
                </button>
              </div>

              <Link
                href={`/admin/orders/${newOrderAlert._id}`}
                onClick={dismissAlert}
                className="block mt-2 group"
              >
                <p className="font-mono text-xs font-bold text-[#0C134F] group-hover:underline">
                  Order #{newOrderAlert.orderNumber}
                </p>
                <p className="text-[11.5px] text-slate-600 truncate mt-0.5">
                  {newOrderAlert.customerSnapshot?.name ||
                    newOrderAlert.shippingAddress?.fullName ||
                    "Customer"}{" "}
                  •{" "}
                  <span className="font-mono font-semibold text-[#0C134F]">
                    {formatCurrency(
                      newOrderAlert.totalAmount || newOrderAlert.total || 0,
                      "PKR"
                    )}
                  </span>
                </p>
              </Link>

              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/admin/orders/${newOrderAlert._id}`}
                  onClick={dismissAlert}
                  className="flex-1"
                >
                  <Button
                    variant="brand"
                    size="xs"
                    className="w-full bg-[#0C134F] hover:bg-[#121A4B] text-white text-[11px] font-bold rounded-lg h-7.5 shadow-2xs cursor-pointer"
                  >
                    Review Order →
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={dismissAlert}
                  className="text-[11px] h-7.5 rounded-lg border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </aside>
      )}
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0 z-30">
        <AdminSidebar />
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        position="left"
        maxWidth="sm"
      >
        <div className="-m-4 sm:-m-6 h-[calc(100vh-5rem)]">
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
