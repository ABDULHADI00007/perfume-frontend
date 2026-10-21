"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminPermission } from "@/features/admin/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: AdminPermission;
  group: "Overview" | "Store Operations" | "Editorial & Marketing" | "System";
  badge?: string;
}

const allNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <Icons.Dashboard size={18} />, group: "Overview" },
  { label: "Orders", href: "/admin/orders", icon: <Icons.Delivery size={18} />, permission: "orders.read", group: "Store Operations" },
  { label: "Products", href: "/admin/products", icon: <Icons.Package size={18} />, permission: "products.read", group: "Store Operations" },
  { label: "Categories", href: "/admin/categories", icon: <Icons.Tag size={18} />, permission: "categories.manage", group: "Store Operations" },
  { label: "Collections", href: "/admin/collections", icon: <Icons.Layers size={18} />, permission: "collections.manage", group: "Store Operations" },
  { label: "Inventory", href: "/admin/inventory", icon: <Icons.ShieldCheck size={18} />, permission: "inventory.read", group: "Store Operations" },
  { label: "Customers", href: "/admin/customers", icon: <Icons.User size={18} />, permission: "customers.read", group: "Store Operations" },
  { label: "Coupons", href: "/admin/coupons", icon: <Icons.Dollar size={18} />, permission: "coupons.read", group: "Editorial & Marketing" },
  { label: "Reviews", href: "/admin/reviews", icon: <Icons.Star size={18} />, permission: "reviews.read", group: "Editorial & Marketing" },
  { label: "Journal", href: "/admin/journal", icon: <Icons.Edit size={18} />, permission: "blog.manage", group: "Editorial & Marketing" },
  { label: "Newsletter", href: "/admin/newsletter", icon: <Icons.Mail size={18} />, permission: "newsletter.manage", group: "Editorial & Marketing" },
  { label: "Settings", href: "/admin/settings", icon: <Icons.Settings size={18} />, permission: "settings.read", group: "System" },
];

export interface AdminSidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  className = "",
  onItemClick,
}) => {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAdminAuth();

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "AD";

  const accessibleItems = allNavItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const groups: NavItem["group"][] = [
    "Overview",
    "Store Operations",
    "Editorial & Marketing",
    "System",
  ];

  return (
    <aside
      className={`w-72 lg:w-80 bg-white h-full max-h-screen p-5 sm:p-6 flex flex-col justify-between font-sans border-r border-slate-200/80 shadow-[2px_0_16px_rgba(18,23,53,0.02)] overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {/* Top Section: Branding & Navigation */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
            onClick={onItemClick}
          >
            <div className="w-9 h-9 rounded-xl bg-[#0C134F] text-white flex items-center justify-center shadow-xs">
              <span className="font-serif font-bold text-base text-[#D4ADFC]">S</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-bold tracking-tight text-[#0C134F]">
                  Soulmate Scents
                </span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  PORTAL
                </span>
              </div>
              <p className="text-[10px] font-sans text-slate-400 font-medium tracking-wide">
                Haute Parfumerie Admin
              </p>
            </div>
          </Link>
        </div>

        {/* Nav Groups */}
        {groups.map((group) => {
          const groupItems = accessibleItems.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;

          return (
            <div key={group} className="space-y-1.5">
              <h4 className="px-3 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 font-sans">
                {group}
              </h4>
              <nav aria-label={group} className="space-y-1">
                {groupItems.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onItemClick}
                      className={`group relative flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-[#0C134F] text-white shadow-xs"
                          : "text-slate-600 hover:text-[#0C134F] hover:bg-slate-100/70"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`transition-colors duration-200 ${
                            isActive
                              ? "text-[#D4ADFC]"
                              : "text-slate-400 group-hover:text-[#0C134F]"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="tracking-wide">{item.label}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4ADFC] shadow-[0_0_8px_#D4ADFC]" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Profile & Shortcuts */}
      <div className="pt-4 mt-6 border-t border-slate-100 space-y-3">
        <Link href="/" target="_blank" className="block w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-between text-xs tracking-wider font-semibold text-slate-600 hover:text-[#0C134F] hover:border-slate-300 bg-slate-50/70 hover:bg-slate-50 rounded-xl py-2 px-3.5 shadow-2xs"
          >
            <span className="flex items-center gap-2">
              <Icons.Eye size={14} className="text-slate-400" />
              <span>Customer Store</span>
            </span>
            <Icons.ExternalLink size={12} className="opacity-70" />
          </Button>
        </Link>

        {/* User Card */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all duration-200 outline-none text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <Avatar className="h-8 w-8 rounded-lg border border-slate-200 bg-[#0C134F] text-white shrink-0">
                  <AvatarFallback className="bg-[#0C134F] text-white font-semibold text-xs rounded-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#0C134F] truncate leading-tight">
                    {user?.email || "admin@soulmatescents.com"}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 truncate">
                      {user?.role ? user.role.replace("_", " ") : "ADMIN"}
                    </span>
                  </div>
                </div>
              </div>
              <Icons.ChevronDown size={14} className="text-slate-400 shrink-0 ml-1 group-hover:text-slate-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-56 font-sans border-slate-200 bg-white shadow-lg rounded-xl p-1">
            <DropdownMenuLabel className="p-3 pb-2">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Logged In Administrator
              </p>
              <p className="text-xs font-semibold text-[#0C134F] truncate mt-0.5">
                {user?.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem asChild className="cursor-pointer text-xs rounded-lg text-slate-700 hover:text-[#0C134F] hover:bg-slate-50 p-2">
              <Link href="/admin/settings" onClick={onItemClick} className="flex items-center gap-2">
                <Icons.Settings size={14} className="text-slate-400" />
                <span>Store Settings</span>
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
    </aside>
  );
};
