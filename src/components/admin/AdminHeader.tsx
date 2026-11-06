"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { useAdminNotification } from "@/features/admin/context/AdminNotificationContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";

export interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
  className?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileMenu,
  className = "",
}) => {
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  const {
    unreadOrdersCount,
    readOrderIds,
    markAsRead,
    markAllAsRead,
    recentOrders,
    pushPermission,
    requestPushPermission,
  } = useAdminNotification();
  const [searchQuery, setSearchQuery] = useState("");

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "AD";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/admin/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header
      className={`h-16 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between gap-4 font-sans ${className}`}
    >
      {/* Left: Mobile Menu + Quick Search Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 text-slate-500 hover:text-[#0C134F] rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Icons.Menu size={20} />
          </button>
        )}

        {/* Global Quick Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
          <div className="relative flex items-center">
            <Icons.Search
              size={15}
              className="absolute left-3.5 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog, orders, customers..."
              className="w-full pl-9 pr-14 py-2 text-xs bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-[#0C134F] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C134F]/10 focus:border-[#0C134F] transition-all"
            />
            <div className="absolute right-2.5 flex items-center gap-0.5">
              <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-white border border-slate-200 rounded text-slate-400 shadow-2xs">
                ↵
              </kbd>
            </div>
          </div>
        </form>
      </div>

      {/* Right Actions: Storefront, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* View Store Button */}
        <Link href="/" target="_blank">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 text-xs tracking-wider font-semibold text-[#0C134F] border-slate-200 bg-white hover:bg-slate-50 rounded-xl gap-1.5 shadow-2xs"
          >
            <span className="hidden sm:inline">View Store</span>
            <Icons.ExternalLink size={13} className="text-slate-400" />
          </Button>
        </Link>

        {/* Notification Bell Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              title="View Notifications"
              className="relative p-2 text-slate-500 hover:text-[#0C134F] rounded-xl hover:bg-slate-100 transition-colors cursor-pointer outline-none"
            >
              <Icons.Bell size={18} />
              {unreadOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold font-mono rounded-full bg-rose-500 text-white flex items-center justify-center ring-2 ring-white shadow-xs animate-in zoom-in-75">
                  {unreadOrdersCount > 99 ? "99+" : unreadOrdersCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-[360px] sm:w-[410px] p-0 rounded-2xl shadow-2xl border border-slate-200/90 font-sans z-50 bg-white overflow-hidden"
          >
            <div className="p-3.5 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-[#0C134F]">Order Notifications</span>
                {unreadOrdersCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-100 text-rose-700 rounded-full border border-rose-200">
                    {unreadOrdersCount} Unread
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                {unreadOrdersCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-[#0C134F] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
                <Link
                  href="/admin/orders"
                  className="text-[11px] font-medium text-slate-500 hover:text-[#0C134F] transition-colors"
                >
                  View all
                </Link>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  <Icons.Check size={20} className="mx-auto mb-1.5 text-emerald-600" />
                  <span>No orders recorded yet.</span>
                </div>
              ) : (
                recentOrders.slice(0, 5).map((ord) => {
                  const isUnread = ord._id ? !readOrderIds.has(ord._id) : false;
                  const orderCust =
                    ord.customerSnapshot?.name ||
                    ord.shippingAddress?.fullName ||
                    "Customer";

                  // Clean status config with compact pill badge
                  const getStatusConfig = (status: string) => {
                    switch (status) {
                      case "awaiting_payment_verification":
                        return {
                          label: "Verify Payment",
                          bg: "bg-amber-50 text-amber-800 border-amber-200",
                          dot: "bg-amber-500",
                        };
                      case "pending":
                        return {
                          label: "Pending",
                          bg: "bg-amber-50 text-amber-800 border-amber-200",
                          dot: "bg-amber-500",
                        };
                      case "confirmed":
                        return {
                          label: "Confirmed",
                          bg: "bg-blue-50 text-blue-800 border-blue-200",
                          dot: "bg-blue-500",
                        };
                      case "delivered":
                        return {
                          label: "Delivered",
                          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
                          dot: "bg-emerald-500",
                        };
                      case "completed":
                        return {
                          label: "Completed",
                          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
                          dot: "bg-emerald-500",
                        };
                      case "cancelled":
                        return {
                          label: "Cancelled",
                          bg: "bg-rose-50 text-rose-800 border-rose-200",
                          dot: "bg-rose-500",
                        };
                      default:
                        return {
                          label: status?.replace(/_/g, " ") || "Order",
                          bg: "bg-slate-100 text-slate-700 border-slate-200",
                          dot: "bg-slate-400",
                        };
                    }
                  };

                  const statusCfg = getStatusConfig(ord.orderStatus);

                  return (
                    <DropdownMenuItem
                      key={ord._id}
                      asChild
                      className={`p-3 px-4 cursor-pointer transition-colors ${
                        isUnread
                          ? "bg-slate-50/90 hover:bg-slate-100/90 border-l-[3.5px] border-[#0C134F]"
                          : "bg-white hover:bg-slate-50/80 border-l-[3.5px] border-transparent"
                      }`}
                      onClick={() => ord._id && markAsRead(ord._id)}
                    >
                      <Link href={`/admin/orders/${ord._id}`} className="block w-full">
                        {/* Line 1: Order # + Status Pill on Left, Price on Right */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full bg-[#0C134F] shrink-0" title="Unread" />
                            )}
                            <span
                              className={`font-mono text-xs tracking-tight truncate ${
                                isUnread ? "font-bold text-[#0C134F]" : "font-semibold text-slate-700"
                              }`}
                            >
                              #{ord.orderNumber}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${statusCfg.bg}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusCfg.dot}`} />
                              <span>{statusCfg.label}</span>
                            </span>
                          </div>

                          <span className="font-mono font-bold text-xs text-[#0C134F] whitespace-nowrap shrink-0 pl-2">
                            {formatCurrency(ord.totalAmount || ord.total || 0, "PKR")}
                          </span>
                        </div>

                        {/* Line 2: Customer Name on Left, Date/Time on Right */}
                        <div className="flex items-center justify-between gap-2 mt-1.5 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1.5 truncate min-w-0">
                            <Icons.User size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate max-w-[200px] font-medium text-slate-600">
                              {orderCust}
                            </span>
                          </div>
                          {ord.createdAt && (
                            <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap shrink-0">
                              {formatDate(ord.createdAt)}
                            </span>
                          )}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })
              )}
            </div>

            {pushPermission !== "granted" && pushPermission !== "unsupported" && (
              <div className="p-2 border-t border-slate-100 bg-amber-50/60 text-center">
                <button
                  type="button"
                  onClick={requestPushPermission}
                  className="w-full py-1.5 px-3 text-[11px] font-semibold text-amber-900 bg-white hover:bg-amber-100/60 rounded-xl border border-amber-200/80 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Icons.Bell size={13} className="text-amber-600" />
                  <span>Enable Mobile Phone Alerts</span>
                </button>
              </div>
            )}

            <div className="p-2 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
              <Link
                href="/admin/orders"
                className="w-full py-2 px-3 text-center text-xs font-bold text-[#0C134F] hover:bg-slate-100/80 rounded-xl transition-colors block"
              >
                Go to Orders Management →
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-4 w-[1px] bg-slate-200 hidden sm:block mx-1" />

        {/* Admin Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all outline-none cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg bg-[#0C134F] text-white border border-slate-200 shadow-2xs">
                <AvatarFallback className="bg-[#0C134F] text-white font-semibold text-xs rounded-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#0C134F] leading-tight max-w-[130px] truncate">
                  {user?.email?.split("@")[0] || "Admin"}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                  {user?.role ? user.role.replace("_", " ") : "ADMIN"}
                </span>
              </div>
              <Icons.ChevronDown size={13} className="text-slate-400 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 font-sans bg-white border-slate-200 shadow-lg rounded-xl p-1">
            <DropdownMenuLabel className="p-3 pb-2">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Signed in as</p>
              <p className="text-xs font-semibold text-[#0C134F] truncate mt-0.5">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem asChild className="cursor-pointer text-xs rounded-lg text-slate-700 hover:text-[#0C134F] hover:bg-slate-50 p-2">
              <Link href="/admin/settings" className="flex items-center gap-2">
                <Icons.Settings size={14} className="text-slate-400" />
                <span>Portal Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer text-xs rounded-lg text-slate-700 hover:text-[#0C134F] hover:bg-slate-50 p-2">
              <Link href="/" target="_blank" className="flex items-center gap-2">
                <Icons.Eye size={14} className="text-slate-400" />
                <span>Customer Storefront</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-xs rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2 flex items-center gap-2"
            >
              <Icons.LogOut size={14} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
