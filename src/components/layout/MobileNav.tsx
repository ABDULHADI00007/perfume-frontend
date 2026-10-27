"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "@/components/ui/drawer";
import { Icons } from "@/components/ui/icons";
import { storefrontNavigation } from "@/config/navigation";

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
}) => {
  const pathname = usePathname();

  const footerContent = (
    <div className="flex flex-col space-y-3 font-sans text-xs">
      <Link
        href="/admin"
        onClick={onClose}
        className="flex items-center space-x-2 text-foreground-muted hover:text-foreground transition-colors uppercase tracking-[0.14em]"
      >
        <Icons.User size={16} />
        <span>Admin Portal</span>
      </Link>
      <div className="pt-2 border-t border-border-subtle text-[11px] text-foreground-subtle">
        <p>Concierge: concierge@maisonparfum.com</p>
      </div>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Maison de Parfum"
      description="Haute Parfumerie & Artisanal Fragrances"
      maxWidth="sm"
      footer={footerContent}
    >
      <div className="flex flex-col space-y-6">
        {/* Search Trigger Button inside Mobile Menu */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenSearch();
          }}
          className="flex items-center space-x-3 w-full px-3.5 py-2.5 border border-border bg-surface-subtle/60 text-foreground-muted hover:border-navy hover:text-foreground text-xs uppercase tracking-[0.14em] transition-all"
        >
          <Icons.Search size={16} />
          <span>Search Fragrances...</span>
        </button>

        {/* Navigation Links */}
        <nav aria-label="Mobile Storefront Navigation" className="flex flex-col space-y-1">
          {storefrontNavigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between py-3 px-2 border-b border-border-subtle transition-colors ${
                  isActive
                    ? "font-serif text-lg text-[#590B16] font-medium border-[#590B16]"
                    : "font-serif text-lg text-foreground hover:text-[#590B16]"
                }`}
              >
                <span>{item.title}</span>
                <Icons.ChevronRight
                  size={16}
                  className={isActive ? "text-[#590B16]" : "text-foreground-subtle"}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </Drawer>
  );
};
