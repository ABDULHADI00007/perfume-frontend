"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [phase, setPhase] = useState<"writing" | "flying" | "done">("writing");
  const [flyOffsets, setFlyOffsets] = useState<{
    deltaX: number;
    deltaY: number;
    scale: number;
  }>({
    deltaX: -360,
    deltaY: -320,
    scale: 0.35,
  });

  useEffect(() => {
    // Lock scroll during intro
    document.body.style.overflow = "hidden";

    const calculateFlyOffsets = () => {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const cx = winW / 2;
      const cy = winH / 2;

      // Base logo container in center (max 420px wide)
      const boxW = Math.min(420, Math.max(280, winW * 0.82));

      // Find navbar brand logo image or container
      const targetImg =
        document.getElementById("navbar-brand-logo-img") ||
        document.getElementById("navbar-brand-logo");

      if (targetImg) {
        const rect = targetImg.getBoundingClientRect();
        const navCenterX = rect.left + rect.width / 2;
        const navCenterY = rect.top + rect.height / 2;
        const targetScale = rect.width > 0 ? rect.width / boxW : 0.35;

        setFlyOffsets({
          deltaX: navCenterX - cx,
          deltaY: navCenterY - cy,
          scale: Math.max(0.18, Math.min(0.55, targetScale)),
        });
      } else {
        const targetLeft = winW >= 1024 ? Math.max(24, (winW - 1280) / 2 + 24) : 16;
        const targetTop = 18;
        const targetWidth = 140;
        const navCenterX = targetLeft + targetWidth / 2;
        const navCenterY = targetTop + 20;

        setFlyOffsets({
          deltaX: navCenterX - cx,
          deltaY: navCenterY - cy,
          scale: targetWidth / boxW,
        });
      }
    };

    calculateFlyOffsets();
    window.addEventListener("resize", calculateFlyOffsets);

    // Timeline:
    // 0.0s - 1.40s: Strictly in the absolute center, handwriting reveal
    // 1.40s: Smooth, gentle luxury flight & scale-down to navbar logo (duration: 1.20s)
    // 2.70s: Landed and completed, preloader unmounts
    const flyTimer = setTimeout(() => {
      calculateFlyOffsets();
      setPhase("flying");
      if (typeof window !== "undefined") {
        (window as any).__HERO_AWAKENED__ = true;
        window.dispatchEvent(new CustomEvent("hero:awaken"));
      }
    }, 1400);

    const doneTimer = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 2700);

    return () => {
      window.removeEventListener("resize", calculateFlyOffsets);
      clearTimeout(flyTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") {
    return null;
  }

  const isFlying = phase === "flying";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pointer-events-none select-none flex items-center justify-center">
        {/* 1. Pure White Luxury Background Sheet that smoothly dissolves during flight */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isFlying ? 0 : 1 }}
          transition={{
            duration: 1.0,
            ease: [0.22, 1, 0.36, 1],
            delay: isFlying ? 0.1 : 0,
          }}
          className="absolute inset-0 bg-white pointer-events-auto"
        >
          {/* Subtle luxury ambient glow */}
          <div className="absolute inset-0 bg-radial from-[#FAF7EE]/60 via-white to-white pointer-events-none" />
        </motion.div>

        {/* 2. Brand Identity Unit — Statically and strictly centered in screen from frame 0 */}
        <motion.div
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={
            isFlying
              ? {
                  x: flyOffsets.deltaX,
                  y: flyOffsets.deltaY,
                  scale: flyOffsets.scale,
                  opacity: [1, 1, 0.95, 0],
                }
              : {
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                }
          }
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            opacity: {
              duration: 1.2,
              times: [0, 0.8, 0.94, 1],
              ease: "linear",
            },
          }}
          style={{
            width: "clamp(280px, 82vw, 420px)",
            willChange: "transform, opacity",
            background: "transparent",
          }}
          className="relative z-[10000] flex flex-col items-center justify-center text-center px-4 bg-transparent"
        >
          {/* Exact Official Clean Brand Logo (100% transparent PNG — zero white box) with smooth calligraphy write-on effect */}
          <div className="relative w-full aspect-[832/345] overflow-hidden bg-transparent">
            <motion.div
              initial={{ clipPath: "inset(0% 100% 0% 0%)", opacity: 0.9 }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
              transition={{
                duration: 1.15,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.05,
              }}
              className="relative w-full h-full bg-transparent flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/perfumes/1789763707946.png"
                alt="Soulmate Scents - Essence of Unbreakable Bonds"
                className="w-full h-full object-contain object-center select-none pointer-events-none"
                draggable={false}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
