"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
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
            aria-label="Open mobile navigation"
            className="md:hidden p-2 text-slate-500 hover:text-[#0C134F] rounded-xl hover:bg-slate-100 transition-colors"
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

        {/* Notification Bell */}
        <Link href="/admin/orders">
          <button
            type="button"
            title="View Notifications"
            className="relative p-2 text-slate-500 hover:text-[#0C134F] rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Icons.Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
        </Link>

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
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#0C134F] leading-tight max-w-[130px] truncate">
                  {user?.email?.split("@")[0] || "Admin"}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                  {user?.role ? user.role.replace("_", " ") : "ADMIN"}
                </span>
              </div>
              <Icons.ChevronDown size={13} className="text-slate-400 hidden md:block" />
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
