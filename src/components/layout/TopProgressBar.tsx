"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const TopProgressBar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Route change completed — clear everything
  useEffect(() => {
    clearTimers();
    setIsNavigating(false);
    setProgress(100);

    const timer = setTimeout(() => {
      setProgress(0);
    }, 350);

    return () => clearTimeout(timer);
  }, [pathname, searchParams, clearTimers]);

  // Intercept link clicks to start top bar progress immediately
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (
        target &&
        target.href &&
        target.href.startsWith(window.location.origin) &&
        !target.getAttribute("target") &&
        !target.hasAttribute("download") &&
        (target.pathname !== window.location.pathname || target.search !== window.location.search)
      ) {
        clearTimers();
        setIsNavigating(true);
        setProgress(20);

        // Gradually increase progress
        intervalRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              return 90;
            }
            const increment = prev < 50 ? 12 : prev < 70 ? 6 : 3;
            return Math.min(prev + increment, 90);
          });
        }, 150);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
      clearTimers();
    };
  }, [clearTimers]);

  if (progress === 0 && !isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3px] w-full bg-transparent overflow-hidden">
      <div
        className="h-full transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "150ms" : "300ms",
          background: "linear-gradient(90deg, #C5A880 0%, #D4ADFC 50%, #C5A880 100%)",
          boxShadow: isNavigating
            ? "0 0 10px 1px rgba(197, 168, 128, 0.8), 0 0 20px 2px rgba(212, 173, 252, 0.5)"
            : "none",
        }}
      />
    </div>
  );
};


