"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminPermission } from "@/features/admin/types";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: AdminPermission;
  group: "Overview" | "Store Operations" | "Editorial & Marketing" | "System";
}

const allNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <Icons.Dashboard size={17} />, group: "Overview" },
  { label: "Orders", href: "/admin/orders", icon: <Icons.Delivery size={17} />, permission: "orders.read", group: "Store Operations" },
  { label: "Products", href: "/admin/products", icon: <Icons.Package size={17} />, permission: "products.read", group: "Store Operations" },
  { label: "Categories", href: "/admin/categories", icon: <Icons.Tag size={17} />, permission: "categories.manage", group: "Store Operations" },
  { label: "Collections", href: "/admin/collections", icon: <Icons.Layers size={17} />, permission: "collections.manage", group: "Store Operations" },
  { label: "Inventory", href: "/admin/inventory", icon: <Icons.ShieldCheck size={17} />, permission: "inventory.read", group: "Store Operations" },
  { label: "Customers", href: "/admin/customers", icon: <Icons.User size={17} />, permission: "customers.read", group: "Store Operations" },
  { label: "Coupons", href: "/admin/coupons", icon: <Icons.Dollar size={17} />, permission: "coupons.read", group: "Editorial & Marketing" },
  { label: "Reviews", href: "/admin/reviews", icon: <Icons.Star size={17} />, permission: "reviews.read", group: "Editorial & Marketing" },
  { label: "Journal", href: "/admin/journal", icon: <Icons.Edit size={17} />, permission: "blog.manage", group: "Editorial & Marketing" },
  { label: "Newsletter", href: "/admin/newsletter", icon: <Icons.Mail size={17} />, permission: "newsletter.manage", group: "Editorial & Marketing" },
  { label: "Settings", href: "/admin/settings", icon: <Icons.Settings size={17} />, permission: "settings.read", group: "System" },
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
  const { hasPermission, role } = useAdminAuth();

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
      className={`w-64 lg:w-72 bg-white min-h-[calc(100vh-4rem)] p-5 lg:p-6 flex flex-col justify-between font-sans shadow-[4px_0_20px_rgba(0,0,0,0.02)] border-0 ${className}`}
    >
      <div className="space-y-6">
        <div className="px-2 py-1 flex items-center justify-between border-b border-[#E6E2EA] pb-3">
          <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#6B6F80]">
            NAVIGATION
          </span>
          {role && (
            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#FBF9F5] text-[#0C134F] border border-[#E6E2EA]">
              {role.replace("_", " ")}
            </span>
          )}
        </div>

        {groups.map((group) => {
          const groupItems = accessibleItems.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;

          return (
            <div key={group} className="space-y-1">
              <h4 className="px-2 text-[9px] uppercase tracking-[0.22em] font-semibold text-[#9497A8] mb-1 font-sans">
                {group.toUpperCase()}
              </h4>
              <nav aria-label={group} className="space-y-0.5">
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
                      className={`group relative flex items-center justify-between px-3.5 py-2 text-xs uppercase tracking-[0.14em] font-medium rounded-lg transition-all duration-150 ${
                        isActive
                          ? "bg-[#0C134F] text-white shadow-xs font-semibold"
                          : "text-[#6B6F80] hover:text-[#121735] hover:bg-[#F8F6F2]"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
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

      <div className="pt-4 border-t border-[#E6E2EA] px-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-[#9497A8] font-mono">
        <span>Soulmate Scents Admin</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2B5A41] inline-block" />
          <span className="text-[#2B5A41] font-medium">Live</span>
        </div>
      </div>
    </aside>
  );
};



