"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "./Container";
import { Icons } from "@/components/ui/icons";
import { SearchModal } from "./SearchModal";
import { MobileNav } from "./MobileNav";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { useCart } from "@/features/cart/hooks/useCart";
import { storefrontNavigation } from "@/config/navigation";

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { cart } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleSearch = () => {
    setIsCartOpen(false);
    setIsMobileNavOpen(false);
    setIsSearchOpen((prev) => !prev);
  };

  const toggleCart = () => {
    setIsSearchOpen(false);
    setIsMobileNavOpen(false);
    setIsCartOpen((prev) => !prev);
  };

  const toggleMobileNav = () => {
    setIsSearchOpen(false);
    setIsCartOpen(false);
    setIsMobileNavOpen((prev) => !prev);
  };

  const handleSearch = (term: string) => {
    setIsSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-30 w-full transition-all duration-300 ease-luxury ${isScrolled
          ? "bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E6E2EA] shadow-subtle py-2 sm:py-2.5"
          : "bg-[#FBF9F5] border-b border-[#E6E2EA]/60 py-2.5 sm:py-3"
          } ${className}`}
      >
        <Container size="wide">
          <div className="flex items-center justify-between gap-4 sm:gap-6">
            {/* Left: Mobile Menu (Mobile) & Brand Wordmark Logo */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={toggleMobileNav}
                aria-label="Open navigation menu"
                className="lg:hidden p-1 -ml-2 text-foreground hover:text-navy transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                <Icons.Menu size={20} />
              </button>

              {/* Brand Logo — Soulmate Scents */}
              <Link
                href="/"
                aria-label="Soulmate Scents Home"
                className="group flex flex-col items-start py-0.5"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/perfumes/1789763707946.png"
                    alt="Soulmate Scents"
                    width={160}
                    height={44}
                    priority
                    className="h-9 sm:h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
                  />

                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav
              aria-label="Main Navigation"
              className="hidden lg:flex items-center space-x-8 xl:space-x-10"
            >
              {storefrontNavigation.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-[11px] uppercase tracking-[0.22em] transition-all relative py-1.5 font-sans ${isActive
                      ? "text-navy font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-navy"
                      : "text-[#6B6F80] hover:text-navy font-medium"
                      }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Account, Shopping Bag) */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={toggleSearch}
                aria-label="Search collection"
                className="p-2 text-[#6B6F80] hover:text-navy transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 font-sans text-xs uppercase tracking-wider"
              >
                <Icons.Search size={18} />
                <span className="hidden xl:inline-block text-[10px] tracking-[0.18em] font-medium">
                  Search
                </span>
              </button>

              {/* Account Link */}
              <Link
                href="/admin"
                aria-label="Account and Administration"
                className="p-2 text-[#6B6F80] hover:text-navy transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Admin / Account"
              >
                <Icons.User size={18} />
              </Link>

              {/* Shopping Bag Trigger */}
              <button
                type="button"
                onClick={toggleCart}
                aria-label={`Shopping bag with ${cart.itemCount} items`}
                className="relative p-2 text-foreground hover:text-navy transition-colors flex items-center justify-center"
              >
                <Icons.Bag size={20} />
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cart.itemCount}
                </span>
              </button>

            </div>
          </div>
        </Container>
      </header>

      {/* Global Overlays & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSearch={toggleSearch}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        itemCount={cart.itemCount}
        subtotal={cart.subtotal}
      />
    </>
  );
};

