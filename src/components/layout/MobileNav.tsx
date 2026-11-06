"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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

  // Custom Brand Header with Soulmate Scents Official Logo
  const headerNode = (
    <div className="flex items-center py-1">
      <Link href="/" onClick={onClose} className="flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/perfumes/1789763707946.webp"
          alt="Soulmate Scents"
          width={160}
          height={44}
          className="h-9 sm:h-10 w-auto object-contain"
        />
      </Link>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={headerNode}
      maxWidth="sm"
    >
      <div className="flex flex-col space-y-6 pt-1">
        {/* Modern 21st-Style Search Bar (Prominent & Spacious) */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            onClose();
            onOpenSearch();
          }}
          className="group flex items-center justify-between w-full h-12 sm:h-13 px-4 rounded-2xl border border-stone-200/90 bg-stone-50/80 hover:bg-white hover:border-[#590B16]/40 text-stone-600 hover:text-black text-sm font-sans transition-all shadow-xs hover:shadow-sm cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <Icons.Search size={18} className="text-[#590B16] group-hover:scale-110 transition-transform" />
            <span className="tracking-wide text-xs sm:text-sm text-stone-500 group-hover:text-stone-800 font-medium">
              Search Fragrances...
            </span>
          </div>
          <span className="text-[11px] uppercase font-mono tracking-wider px-2.5 py-1 rounded-lg bg-stone-200/70 text-stone-700 font-semibold group-hover:bg-[#590B16] group-hover:text-white transition-colors">
            Search
          </span>
        </motion.button>

        {/* Navigation Links: Home, Collection, Contact */}
        <nav aria-label="Mobile Storefront Navigation" className="flex flex-col divide-y divide-stone-100">
          {storefrontNavigation.map((item, idx) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, delay: idx * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between py-4 px-2 transition-all group ${
                    isActive
                      ? "text-[#590B16] font-semibold"
                      : "text-stone-900 hover:text-[#590B16]"
                  }`}
                >
                  <span
                    className="font-serif text-lg tracking-wider uppercase font-semibold"
                    style={{ fontFamily: "'Cinzel', 'Marcellus', serif" }}
                  >
                    {item.title}
                  </span>
                  <Icons.ChevronRight
                    size={17}
                    className={`transition-transform group-hover:translate-x-1 ${
                      isActive ? "text-[#590B16]" : "text-stone-300 group-hover:text-[#590B16]"
                    }`}
                  />
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>
    </Drawer>
  );
};
