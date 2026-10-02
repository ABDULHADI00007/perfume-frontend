"use client";

import React from "react";
import Link from "next/link";
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
  const { user, logout } = useAdminAuth();

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "AD";

  return (
    <header
      className={`h-16 bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-sticky font-sans shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0 ${className}`}
    >
      {/* Left Branding */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Open navigation menu"
            className="md:hidden p-2 text-[#6B6F80] hover:text-[#121735] focus:outline-none rounded-lg hover:bg-[#FBF9F5] transition-colors"
          >
            <Icons.Menu size={20} />
          </button>
        )}

        <Link
          href="/admin"
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
        >
          <span className="font-serif text-xl font-normal tracking-wide text-[#0C134F]">
            Soulmate Scents
          </span>
          <span className="inline-block text-[9px] font-sans font-medium tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm bg-[#FBF9F5] text-[#0C134F] border border-[#E6E2EA]">
            ADMIN
          </span>
        </Link>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        <Link href="/" target="_blank">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs tracking-[0.14em] text-[#6B6F80] hover:text-[#0C134F]"
          >
            <span>VIEW STORE</span>
            <Icons.ExternalLink size={13} className="opacity-80" />
          </Button>
        </Link>

        <div className="h-4 w-[1px] bg-[#E6E2EA]" />

        {/* Admin Profile Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-[#FBF9F5] transition-all duration-200 outline-none focus:ring-1 focus:ring-[#0C134F]/20 cursor-pointer"
            >
              <Avatar className="h-8 w-8 border border-[#E6E2EA] bg-[#0C134F] text-white">
                <AvatarFallback className="bg-[#0C134F] text-white font-medium text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-medium text-[#121735] leading-tight">
                  {user?.email || "admin@soulmatescents.com"}
                </span>
                <span className="text-[10px] text-[#6B6F80] uppercase tracking-wider font-mono">
                  {user?.role ? user.role.replace("_", " ") : "Administrator"}
                </span>
              </div>
              <Icons.ChevronDown size={14} className="text-[#6B6F80] hidden md:inline" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 font-sans border-[#E6E2EA] bg-white">
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#6B6F80]">Signed in as</p>
                <p className="text-xs font-medium text-[#121735] truncate">{user?.email || "admin@soulmatescents.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E6E2EA]" />
            <DropdownMenuItem asChild className="cursor-pointer text-xs focus:bg-[#FBF9F5]">
              <Link href="/admin/settings" className="flex items-center gap-2 text-[#121735]">
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
      </div>
    </header>
  );
};



