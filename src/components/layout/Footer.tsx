"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 400));
    setStatus("success");
    setEmail("");
  };

  return (
    <footer
      aria-label="Site Footer"
      className={`relative w-full bg-[#060B16] text-[#A4B1C3] border-t border-[#121B2C] font-sans overflow-hidden ${className}`}
    >
      {/* Dark Floral Watermark Overlay on Right Side */}
      <div
        className="absolute right-0 bottom-0 top-0 w-1/3 pointer-events-none opacity-15 bg-right-bottom bg-no-repeat bg-contain"
        style={{ backgroundImage: "url('/images/perfumes/flowers_img.png')" }}
      />

      {/* Main Grid Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 pb-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          {/* Column 1: Brand Info & Socials */}
          <div className="lg:col-span-3 flex flex-col items-start text-left space-y-4">
            <Link href="/" aria-label="Soulmate Scents Home" className="inline-block group">
              <Image
                src="/images/perfumes/soulmate_logo_transparent.png"
                alt="Soulmate Scents Logo"
                width={175}
                height={52}
                className="h-11 sm:h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>

            <p className="text-xs sm:text-[13px] text-[#A4B1C3] font-normal leading-relaxed">
              More than a scent.
              <br />
              A story that stays.
            </p>

            {/* Social Icons (Instagram, Facebook, Pinterest, YouTube, TikTok) */}
            <div className="flex items-center space-x-4 pt-1 text-[#A4B1C3]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.67 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.56-1.36 2.56-.09 1.4.74 2.78 2.01 3.32 1.06.46 2.33.35 3.3-.26.85-.53 1.39-1.48 1.45-2.48.06-3.4.03-6.8.04-10.2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="lg:col-span-2 flex flex-col items-start text-left">
            <h3 className="font-sans text-xs sm:text-[13px] font-bold text-white mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#A4B1C3]">
              <li>
                <Link href="/perfumes" prefetch={false} className="hover:text-white transition-colors">
                  All Perfumes
                </Link>
              </li>
              <li>
                <Link href="/perfumes?gender=men" prefetch={false} className="hover:text-white transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/perfumes?gender=women" prefetch={false} className="hover:text-white transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/perfumes?gender=unisex" prefetch={false} className="hover:text-white transition-colors">
                  Unisex
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Collections */}
          <div className="lg:col-span-2 flex flex-col items-start text-left">
            <h3 className="font-sans text-xs sm:text-[13px] font-bold text-white mb-4">
              Collections
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#A4B1C3]">
              <li>
                <Link href="/perfumes?collection=ethereal" prefetch={false} className="hover:text-white transition-colors">
                  Ethereal Collections
                </Link>
              </li>
              <li>
                <Link href="/perfumes?collection=platinum" prefetch={false} className="hover:text-white transition-colors">
                  Platinum Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="lg:col-span-2 flex flex-col items-start text-left">
            <h3 className="font-sans text-xs sm:text-[13px] font-bold text-white mb-4">
              Support
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#A4B1C3]">
              <li>
                <Link href="/shipping" prefetch={false} className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" prefetch={false} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" prefetch={false} className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={false} className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Join Our Story */}
          <div className="lg:col-span-3 flex flex-col items-start text-left">
            <h3 className="font-sans text-xs sm:text-[13px] font-bold text-white mb-2.5">
              Join Our Story
            </h3>
            <p className="text-xs sm:text-[13px] text-[#A4B1C3] leading-relaxed mb-4 max-w-xs">
              Be the first to know about new fragrances and exclusive offers.
            </p>

            {status === "success" ? (
              <div className="p-3 bg-[#121E34] text-white text-xs rounded-md">
                Thank you for subscribing to Soulmate Scents.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center w-full max-w-xs sm:max-w-sm bg-[#F7F6F2] rounded-md p-1 border border-white/20 shadow-inner">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 bg-transparent px-3 py-2 text-xs text-[#060B16] placeholder:text-[#8892A0] focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="bg-[#060B16] hover:bg-black text-white p-2 rounded-md transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer min-w-[34px] min-h-[34px]"
                >
                  <Icons.ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Sub-Footer Bar Line */}
        <div className="w-full mt-12 pt-6 border-t border-[#121B2C] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7B889B] font-normal">
          <p>© {new Date().getFullYear()} Soulmate Scents. All rights reserved.</p>

          <div className="hidden md:flex items-center space-x-3 select-none text-[10px] uppercase tracking-widest font-medium text-[#68768A]">
            <span>— A FRAGRANCE FOR EVERY STORY —</span>
          </div>

          <div className="flex items-center space-x-6 text-[#7B889B]">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
