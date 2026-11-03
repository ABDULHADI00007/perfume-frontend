"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { useAdminNotification } from "@/features/admin/context/AdminNotificationContext";
import { AdminPermission } from "@/features/admin/types";

export interface NavItem {
  label: string;
  href: string;
  icon: (props: { className?: string; size?: number }) => React.ReactNode;
  permission?: AdminPermission;
  group: "Overview" | "Store Management" | "Marketing" | "Configuration";
  badge?: string;
}

const allNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (p) => <Icons.Dashboard size={p.size ?? 20} className={p.className} />,
    group: "Overview",
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: (p) => <Icons.Delivery size={p.size ?? 20} className={p.className} />,
    permission: "orders.read",
    group: "Store Management",
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: (p) => <Icons.Package size={p.size ?? 20} className={p.className} />,
    permission: "products.read",
    group: "Store Management",
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: (p) => <Icons.Layers size={p.size ?? 20} className={p.className} />,
    permission: "inventory.read",
    group: "Store Management",
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: (p) => <Icons.User size={p.size ?? 20} className={p.className} />,
    permission: "customers.read",
    group: "Store Management",
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: (p) => <Icons.Tag size={p.size ?? 20} className={p.className} />,
    permission: "coupons.read",
    group: "Marketing",
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: (p) => <Icons.Star size={p.size ?? 20} className={p.className} />,
    permission: "reviews.read",
    group: "Marketing",
  },
  {
    label: "Newsletter",
    href: "/admin/newsletter",
    icon: (p) => <Icons.Mail size={p.size ?? 20} className={p.className} />,
    permission: "newsletter.manage",
    group: "Marketing",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: (p) => <Icons.Settings size={p.size ?? 20} className={p.className} />,
    permission: "settings.read",
    group: "Configuration",
  },
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
  const { unreadOrdersCount } = useAdminNotification();

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
      className={`w-72 lg:w-76 bg-white h-full max-h-screen p-5 flex flex-col font-sans border-r border-slate-200/90 shadow-[2px_0_20px_rgba(18,23,53,0.03)] overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {/* Top Section: Branding & Navigation */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center justify-between w-full group transition-all"
            onClick={onItemClick}
          >
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/perfumes/1789763707946.png"
                alt="Soulmate Scents"
                width={150}
                height={40}
                priority
                className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#0C134F]/5 text-[#0C134F] border border-[#0C134F]/10">
              PORTAL
            </span>
          </Link>
        </div>

        {/* Nav Groups */}
        <div className="space-y-5">
          {groups.map((group) => {
            const groupItems = accessibleItems.filter((item) => item.group === group);
            if (groupItems.length === 0) return null;

            return (
              <div key={group} className="space-y-1.5">
                <h4 className="px-3.5 text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400 font-mono flex items-center justify-between">
                  <span>{group}</span>
                </h4>
                <nav aria-label={group} className="space-y-1">
                  {groupItems.map((item) => {
                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname?.startsWith(item.href);

                    const isOrders = item.label === "Orders" || item.href === "/admin/orders";
                    const orderBadgeCount = isOrders && unreadOrdersCount > 0 ? unreadOrdersCount : null;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onItemClick}
                        className={`group relative flex items-center justify-between px-3.5 py-3 text-[14px] rounded-xl transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-[#0C134F] text-white font-semibold shadow-md shadow-[#0C134F]/15"
                            : "text-[#334155] font-medium hover:text-[#0C134F] hover:bg-slate-100/80 hover:translate-x-1"
                        }`}
                      >
                        <div className="flex items-center space-x-3.5">
                          <span
                            className={`flex items-center justify-center transition-colors duration-200 ${
                              isActive
                                ? "text-[#E5C38B]"
                                : "text-slate-400 group-hover:text-[#0C134F]"
                            }`}
                          >
                            {item.icon({ size: 20 })}
                          </span>
                          <span className="tracking-wide">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {orderBadgeCount !== null ? (
                            <span
                              className={`min-w-[20px] h-[20px] px-1.5 flex items-center justify-center text-[10.5px] font-mono font-bold rounded-full shadow-xs transition-transform duration-200 group-hover:scale-105 ${
                                isActive
                                  ? "bg-[#E5C38B] text-[#0C134F] font-extrabold"
                                  : "bg-rose-500 text-white"
                              }`}
                            >
                              {orderBadgeCount > 99 ? "99+" : orderBadgeCount}
                            </span>
                          ) : (
                            /* Active indicator dot (only shown when no unread orders) */
                            isActive && (
                              <span className="w-2 h-2 rounded-full bg-[#E5C38B] shadow-[0_0_10px_#E5C38B]" />
                            )
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
