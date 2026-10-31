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
import { WishlistDrawer } from "@/features/wishlist/components/WishlistDrawer";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { storefrontNavigation } from "@/config/navigation";

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { cart, isCartOpen, closeCart, toggleCart } = useCart();
  const { itemCount: wishlistCount, toggleWishlist, closeWishlist } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleSearch = () => {
    closeCart();
    closeWishlist();
    setIsMobileNavOpen(false);
    setIsSearchOpen((prev) => !prev);
  };

  const handleToggleCart = () => {
    setIsSearchOpen(false);
    closeWishlist();
    setIsMobileNavOpen(false);
    toggleCart();
  };

  const handleToggleWishlist = () => {
    setIsSearchOpen(false);
    closeCart();
    setIsMobileNavOpen(false);
    toggleWishlist();
  };

  const toggleMobileNav = () => {
    closeCart();
    closeWishlist();
    setIsSearchOpen(false);
    setIsMobileNavOpen((prev) => !prev);
  };

  const handleSearch = (term: string) => {
    setIsSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 15);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        closeCart();
        closeWishlist();
        setIsMobileNavOpen(false);
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeCart, closeWishlist]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ease-luxury bg-white/10 backdrop-blur-xl border-b border-white/15 ${isScrolled
          ? "py-2 sm:py-2.5 bg-white/12"
          : "py-2.5 sm:py-3"
          } ${className}`}
        style={{
          WebkitBackdropFilter: "blur(25px)",
          backdropFilter: "blur(25px)",
        }}
      >
        <Container size="wide">
          <div className="flex items-center justify-between gap-4 sm:gap-6">
            {/* Left: Brand Wordmark Logo */}
            <div className="flex items-center space-x-3 sm:space-x-4">
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
                      ? "text-[#590B16] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#590B16]"
                      : "text-black hover:text-[#590B16] font-medium"
                      }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Wishlist, Shopping Bag, Hamburger Menu) */}
            <div className="flex items-center space-x-1.5 sm:space-x-3.5 flex-shrink-0">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={toggleSearch}
                aria-label="Search collection"
                className="p-2 text-black hover:text-[#590B16] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 font-sans text-xs uppercase tracking-wider cursor-pointer"
              >
                <Icons.Search size={18} />
                <span className="hidden xl:inline-block text-[10px] tracking-[0.18em] font-medium text-black group-hover:text-[#590B16]">
                  Search
                </span>
              </button>

              {/* Wishlist Trigger (Replaces Admin / User Icon) */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label={`Saved fragrances wishlist with ${wishlistCount} items`}
                className="relative p-2 text-black hover:text-[#590B16] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                title="Saved Fragrances"
              >
                <Icons.Heart
                  size={19}
                  className="stroke-current fill-none stroke-[2]"
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#590B16] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Bag Trigger */}
              <button
                type="button"
                onClick={handleToggleCart}
                aria-label={`Shopping bag with ${cart.itemCount} items`}
                className="relative p-2 text-black hover:text-[#590B16] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <Icons.Bag size={20} />
                <span className="absolute -top-0.5 -right-0.5 bg-[#590B16] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cart.itemCount}
                </span>
              </button>

              {/* Mobile Hamburger Menu Trigger (Placed after Add to Cart / Shopping Bag) */}
              <button
                type="button"
                onClick={toggleMobileNav}
                aria-label="Open navigation menu"
                className="lg:hidden p-2 text-black hover:text-[#590B16] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <Icons.Menu size={22} />
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

      <WishlistDrawer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        itemCount={cart.itemCount}
        subtotal={cart.subtotal}
      />
    </>
  );
};

