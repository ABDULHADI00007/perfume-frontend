"use client";

import React from "react";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";

export interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
  className?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileMenu,
  className = "",
}) => {
  const { user, logout } = useAdminAuth();

  return (
    <header
      className={`h-16 border-b border-border bg-surface px-4 sm:px-8 flex items-center justify-between z-sticky font-sans ${className}`}
    >
      <div className="flex items-center space-x-3 sm:space-x-4">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Open navigation menu"
            className="md:hidden p-2 text-foreground-muted hover:text-foreground focus:outline-none"
          >
            <Icons.Menu size={20} />
          </button>
        )}

        <Link
          href="/admin"
          className="font-serif text-lg font-normal tracking-wide text-foreground flex items-center gap-2"
        >
          <span>Maison de Parfum</span>
          <span className="text-[10px] uppercase tracking-[0.2em] font-sans px-2 py-0.5 border border-border text-foreground-muted">
            Admin
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <Link
          href="/"
          target="_blank"
          className="text-xs uppercase tracking-wider text-foreground-muted hover:text-foreground flex items-center gap-1 font-sans transition-colors"
        >
          <span className="hidden sm:inline">View Store</span>
          <Icons.ExternalLink size={14} />
        </Link>

        <div className="h-4 w-[1px] bg-border" />

        <div className="flex items-center space-x-3 text-xs font-sans text-foreground">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-foreground font-medium">{user?.email}</span>
            <span className="text-[10px] text-foreground-subtle uppercase tracking-wider">
              {user?.role?.replace("_", " ")}
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
            className="p-1.5 text-foreground-subtle hover:text-status-error transition-colors"
          >
            <Icons.LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};


