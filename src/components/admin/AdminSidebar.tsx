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
}

const allNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <Icons.Dashboard size={18} /> },
  { label: "Orders", href: "/admin/orders", icon: <Icons.Delivery size={18} />, permission: "orders.read" },
  { label: "Products", href: "/admin/products", icon: <Icons.Package size={18} />, permission: "products.read" },
  { label: "Categories", href: "/admin/categories", icon: <Icons.Tag size={18} />, permission: "categories.manage" },
  { label: "Collections", href: "/admin/collections", icon: <Icons.Layers size={18} />, permission: "collections.manage" },
  { label: "Inventory", href: "/admin/inventory", icon: <Icons.ShieldCheck size={18} />, permission: "inventory.read" },
  { label: "Customers", href: "/admin/customers", icon: <Icons.User size={18} />, permission: "customers.read" },
  { label: "Coupons", href: "/admin/coupons", icon: <Icons.Dollar size={18} />, permission: "coupons.read" },
  { label: "Reviews", href: "/admin/reviews", icon: <Icons.Star size={18} />, permission: "reviews.read" },
  { label: "Journal", href: "/admin/journal", icon: <Icons.Edit size={18} />, permission: "blog.manage" },
  { label: "Newsletter", href: "/admin/newsletter", icon: <Icons.Mail size={18} />, permission: "newsletter.manage" },
  { label: "Settings", href: "/admin/settings", icon: <Icons.Settings size={18} />, permission: "settings.read" },
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

  return (
    <aside
      className={`w-64 border-r border-border bg-surface min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between font-sans ${className}`}
    >
      <div>
        <div className="mb-4 px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-foreground-muted border-b border-border-subtle flex items-center justify-between">
          <span>Main Navigation</span>
          {role && (
            <span className="text-[9px] px-2 py-0.5 bg-surface-subtle text-foreground border border-border uppercase tracking-wider font-mono">
              {role.replace("_", " ")}
            </span>
          )}
        </div>
        <nav aria-label="Admin Navigation" className="space-y-1">
          {accessibleItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={`group flex items-center space-x-3 px-3.5 py-2.5 text-xs uppercase tracking-[0.14em] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
                }`}
              >
                <span className={isActive ? "text-primary-foreground" : "text-foreground-subtle group-hover:text-foreground"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-border-subtle px-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-foreground-subtle">
        <span>Admin Vault v1.0</span>
        <span className="w-1.5 h-1.5 rounded-full bg-status-success inline-block" title="Online" />
      </div>
    </aside>

  );
};


