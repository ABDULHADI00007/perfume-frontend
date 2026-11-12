"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function FloatingWhatsAppButton() {
  const pathname = usePathname();

  // Admin routes par floating button hide rakhein
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const phoneNumber = "923337615355";
  const defaultMessage = encodeURIComponent(
    "Hello Soulmate Scents! I would like to inquire about your luxury perfumes."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <aside
      aria-label="WhatsApp live chat support"
      className="fixed bottom-7 right-8 sm:bottom-10 sm:right-12 z-[9990] flex items-center group pointer-events-auto select-none"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Soulmate Scents on WhatsApp"
        className="relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#00D756] text-white shadow-[0_8px_28px_rgba(0,215,86,0.55)] hover:shadow-[0_12px_36px_rgba(0,215,86,0.75)] hover:scale-108 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-[#00D756]/40 cursor-pointer"
      >
        {/* Subtle Pulse Animation Ring */}
        <span
          className="absolute inset-0 rounded-full bg-[#00D756] animate-ping opacity-30 pointer-events-none"
          aria-hidden="true"
        />

        {/* Official Crisp WhatsApp SVG Icon (Enlarged) */}
        <svg
          className="w-10 h-10 sm:w-11 sm:h-11 fill-current relative z-10 drop-shadow-xs"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.39C16.32 14.27 15.1 13.67 14.87 13.58C14.65 13.5 14.48 13.46 14.32 13.71C14.15 13.96 13.67 14.52 13.52 14.69C13.38 14.85 13.23 14.88 12.98 14.75C12.73 14.63 11.93 14.36 10.98 13.52C10.24 12.86 9.74 12.05 9.6 11.8C9.45 11.55 9.58 11.42 9.71 11.29C9.82 11.18 9.96 11 10.08 10.86C10.21 10.72 10.25 10.62 10.33 10.45C10.41 10.29 10.37 10.14 10.31 10.02C10.25 9.9 9.75 8.68 9.55 8.17C9.35 7.68 9.14 7.74 8.99 7.73C8.84 7.72 8.67 7.72 8.51 7.72C8.34 7.72 8.07 7.78 7.84 8.03C7.62 8.28 6.98 8.87 6.98 10.08C6.98 11.29 7.86 12.46 7.99 12.62C8.11 12.79 9.73 15.28 12.21 16.35C12.8 16.61 13.26 16.76 13.62 16.87C14.21 17.06 14.75 17.03 15.18 16.97C15.66 16.9 16.65 16.37 16.86 15.79C17.06 15.2 17.06 14.71 17 14.6C16.94 14.49 16.82 14.42 16.57 14.39Z" />
        </svg>
      </a>
    </aside>
  );
}

