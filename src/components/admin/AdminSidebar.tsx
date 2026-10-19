"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminPermission } from "@/features/admin/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
}

const allNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <Icons.Dashboard size={19} />, group: "Overview" },
  { label: "Orders", href: "/admin/orders", icon: <Icons.Delivery size={19} />, permission: "orders.read", group: "Store Operations" },
  { label: "Products", href: "/admin/products", icon: <Icons.Package size={19} />, permission: "products.read", group: "Store Operations" },
  { label: "Categories", href: "/admin/categories", icon: <Icons.Tag size={19} />, permission: "categories.manage", group: "Store Operations" },
  { label: "Collections", href: "/admin/collections", icon: <Icons.Layers size={19} />, permission: "collections.manage", group: "Store Operations" },
  { label: "Inventory", href: "/admin/inventory", icon: <Icons.ShieldCheck size={19} />, permission: "inventory.read", group: "Store Operations" },
  { label: "Customers", href: "/admin/customers", icon: <Icons.User size={19} />, permission: "customers.read", group: "Store Operations" },
  { label: "Coupons", href: "/admin/coupons", icon: <Icons.Dollar size={19} />, permission: "coupons.read", group: "Editorial & Marketing" },
  { label: "Reviews", href: "/admin/reviews", icon: <Icons.Star size={19} />, permission: "reviews.read", group: "Editorial & Marketing" },
  { label: "Journal", href: "/admin/journal", icon: <Icons.Edit size={19} />, permission: "blog.manage", group: "Editorial & Marketing" },
  { label: "Newsletter", href: "/admin/newsletter", icon: <Icons.Mail size={19} />, permission: "newsletter.manage", group: "Editorial & Marketing" },
  { label: "Settings", href: "/admin/settings", icon: <Icons.Settings size={19} />, permission: "settings.read", group: "System" },
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
      className={`w-72 lg:w-80 bg-white h-full max-h-screen p-6 flex flex-col justify-between font-sans border-r border-[#E6E2EA] shadow-[4px_0_20px_rgba(0,0,0,0.02)] overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {/* Top Section: Branding & Navigation */}
      <div className="space-y-7">
        {/* Brand Header */}
        <div className="px-2 py-1 flex items-center justify-between border-b border-[#E6E2EA] pb-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            onClick={onItemClick}
          >
            <span className="font-serif text-lg font-medium tracking-wide text-[#0C134F]">
              Soulmate Scents
            </span>
            <Badge variant="secondary" size="sm" className="font-mono text-[9px]">
              ADMIN
            </Badge>
          </Link>
        </div>

        {/* Nav Groups */}
        {groups.map((group) => {
          const groupItems = accessibleItems.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;

          return (
            <div key={group} className="space-y-2">
              <h4 className="px-2 text-[10px] uppercase tracking-[0.22em] font-semibold text-[#9497A8] mb-2.5 font-sans">
                {group.toUpperCase()}
              </h4>
              <nav aria-label={group} className="space-y-2">
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
                      className={`group relative flex items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.14em] font-medium rounded-xl transition-all duration-150 ${
                        isActive
                          ? "bg-[#0C134F] text-white shadow-xs font-semibold"
                          : "text-[#6B6F80] hover:text-[#121735] hover:bg-[#FBF9F5]"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <span
                          className={`transition-colors duration-150 ${
                            isActive
                              ? "text-white"
                              : "text-[#6B6F80] group-hover:text-[#121735]"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4ADFC]" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Bottom Section: View Store & Profile Menu (Adjusted under sidebar) */}
      <div className="pt-4 mt-6 border-t border-[#E6E2EA] space-y-3">
        {/* View Store Button */}
        <Link href="/" target="_blank" className="block w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-between text-xs tracking-[0.14em] text-[#6B6F80] hover:text-[#0C134F] hover:border-[#0C134F] bg-[#FBF9F5]"
          >
            <span>VIEW STORE</span>
            <Icons.ExternalLink size={13} className="opacity-80" />
          </Button>
        </Link>

        {/* Profile Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 rounded-xl border border-[#E6E2EA] bg-[#FBF9F5] hover:bg-white hover:shadow-xs transition-all duration-200 outline-none text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <Avatar className="h-8 w-8 border border-[#E6E2EA] bg-[#0C134F] text-white shrink-0">
                  <AvatarFallback className="bg-[#0C134F] text-white font-medium text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-[#121735] truncate leading-tight">
                    {user?.email || "admin@soulmatescents.com"}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge variant="neutral" size="sm" className="text-[8px] px-1.5 py-0">
                      {user?.role ? user.role.replace("_", " ") : "SUPERADMIN"}
                    </Badge>
                  </div>
                </div>
              </div>
              <Icons.ChevronDown size={14} className="text-[#6B6F80] shrink-0 ml-1 group-hover:text-[#121735]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-56 font-sans border-[#E6E2EA] bg-white shadow-lg">
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#6B6F80]">
                  Signed in as
                </p>
                <p className="text-xs font-medium text-[#121735] truncate">
                  {user?.email || "admin@soulmatescents.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E6E2EA]" />
            <DropdownMenuItem asChild className="cursor-pointer text-xs focus:bg-[#FBF9F5]">
              <Link href="/admin/settings" onClick={onItemClick} className="flex items-center gap-2 text-[#121735]">
                <Icons.Settings size={14} className="text-[#6B6F80]" />
                <span>Store Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer text-xs focus:bg-[#FBF9F5]">
              <Link href="/" target="_blank" className="flex items-center gap-2 text-[#121735]">
                <Icons.ExternalLink size={14} className="text-[#6B6F80]" />
                <span>Open Storefront</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#E6E2EA]" />
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-xs text-[#9E2A2B] focus:text-[#9E2A2B] focus:bg-[#FDF2F2] flex items-center gap-2"
            >
              <Icons.LogOut size={14} />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Live Status indicator */}
        <div className="pt-2 px-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-[#9497A8] font-mono">
          <span>Soulmate Scents</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2B5A41] inline-block" />
            <span className="text-[#2B5A41] font-medium">Live</span>
          </div>
        </div>
      </div>
    </aside>
  );
};



