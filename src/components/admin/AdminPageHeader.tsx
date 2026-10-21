"use client";

import React from "react";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AdminPageHeaderProps {
  category?: string;
  title: string;
  description?: string;
  count?: number;
  badge?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  category,
  title,
  description,
  count,
  badge,
  breadcrumbs,
  actions,
  children,
  className = "",
}) => {
  return (
    <div className={`space-y-4 pb-6 border-b border-slate-200/80 ${className}`}>
      {/* Optional Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs">
          <Link
            href="/admin"
            className="text-slate-400 hover:text-[#0C134F] transition-colors flex items-center gap-1 font-medium"
          >
            <Icons.Dashboard size={13} />
            <span>Admin</span>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <Icons.ChevronRight size={12} className="text-slate-300 shrink-0" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-slate-500 hover:text-[#0C134F] transition-colors font-medium truncate max-w-[200px]"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#0C134F] font-semibold truncate max-w-[220px]">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          {category && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#8E95A2]">
                {category}
              </span>
              {badge && (
                <Badge variant="secondary" size="sm" className="font-mono text-[9px] px-2 py-0.5">
                  {badge}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0C134F]">
              {title}
            </h1>
            {typeof count === "number" && (
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-mono font-semibold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                {count}
              </span>
            )}
          </div>

          {description && (
            <p className="text-xs sm:text-sm text-slate-500 font-sans max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {(actions || children) && (
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {actions}
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
