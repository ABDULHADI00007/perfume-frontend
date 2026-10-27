"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminPermission } from "@/features/admin/types";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: AdminPermission;
  group: "Overview" | "Store Management" | "Marketing" | "Configuration";
  badge?: string;
}

const allNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <Icons.Dashboard size={18} />, group: "Overview" },
  { label: "Orders", href: "/admin/orders", icon: <Icons.Delivery size={18} />, permission: "orders.read", group: "Store Management" },
  { label: "Products", href: "/admin/products", icon: <Icons.Package size={18} />, permission: "products.read", group: "Store Management" },
  { label: "Categories", href: "/admin/categories", icon: <Icons.Tag size={18} />, permission: "categories.manage", group: "Store Management" },
  { label: "Collections", href: "/admin/collections", icon: <Icons.Layers size={18} />, permission: "collections.manage", group: "Store Management" },
  { label: "Inventory", href: "/admin/inventory", icon: <Icons.ShieldCheck size={18} />, permission: "inventory.read", group: "Store Management" },
  { label: "Customers", href: "/admin/customers", icon: <Icons.User size={18} />, permission: "customers.read", group: "Store Management" },
  { label: "Coupons", href: "/admin/coupons", icon: <Icons.Dollar size={18} />, permission: "coupons.read", group: "Marketing" },
  { label: "Reviews", href: "/admin/reviews", icon: <Icons.Star size={18} />, permission: "reviews.read", group: "Marketing" },
  { label: "Journal", href: "/admin/journal", icon: <Icons.Edit size={18} />, permission: "blog.manage", group: "Marketing" },
  { label: "Newsletter", href: "/admin/newsletter", icon: <Icons.Mail size={18} />, permission: "newsletter.manage", group: "Marketing" },
  { label: "Settings", href: "/admin/settings", icon: <Icons.Settings size={18} />, permission: "settings.read", group: "Configuration" },
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
  const { hasPermission } = useAdminAuth();

  const accessibleItems = allNavItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const groups: NavItem["group"][] = [
    "Overview",
    "Store Management",
    "Marketing",
    "Configuration",
  ];

  return (
    <aside
      className={`w-72 lg:w-80 bg-white h-full max-h-screen p-5 sm:p-6 flex flex-col font-sans border-r border-slate-200/80 shadow-[2px_0_16px_rgba(18,23,53,0.02)] overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {/* Top Section: Branding & Navigation */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center justify-between w-full group transition-opacity hover:opacity-90"
            onClick={onItemClick}
          >
            <Image
              src="/images/perfumes/1789763707946.png"
              alt="Soulmate Scents"
              width={145}
              height={38}
              priority
              className="h-8 sm:h-9 w-auto object-contain"
            />
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
              PORTAL
            </span>
          </Link>
        </div>

        {/* Nav Groups */}
        {groups.map((group) => {
          const groupItems = accessibleItems.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;

          return (
            <div key={group} className="space-y-1.5">
              <h4 className="px-3 text-[10px] uppercase tracking-[0.22em] font-bold text-slate-400 font-mono flex items-center justify-between">
                <span>{group}</span>
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
                          ? "bg-[#0C134F] text-white shadow-sm"
                          : "text-slate-600 hover:text-[#0C134F] hover:bg-slate-50 hover:translate-x-0.5"
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
                        <span className="tracking-wide font-sans">{item.label}</span>
                      </div>

                      {/* Active indicator dot */}
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
    </aside>
  );
};
