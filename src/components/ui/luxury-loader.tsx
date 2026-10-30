"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LuxuryLoaderProps extends React.ComponentProps<"div"> {
  size?: number; // e.g. 36, 48, 64
  color?: string;
  glowColor?: string;
  showDroplet?: boolean;
}

export function LuxuryLoader({
  size = 48,
  color = "#590B16",
  glowColor = "rgba(89, 11, 22, 0.25)",
  showDroplet = true,
  className,
  ...props
}: LuxuryLoaderProps) {
  const sizePx = `${size}px`;
  const barWidth = `${Math.max(size * 0.18, 3.5).toFixed(1)}px`;
  const barHeight = `${Math.max(size * 0.065, 2.2).toFixed(1)}px`;

  return (
    <div
      className={cn("relative flex items-center justify-center select-none", className)}
      style={{ width: sizePx, height: sizePx }}
      {...props}
    >
      {/* Outer ambient glow halo */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-60 animate-pulse pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Thin Gold / Burgundy Orbital Ring */}
      <div
        className="absolute inset-0 rounded-full border border-[#590B16]/20"
        style={{
          boxShadow: `0 0 14px ${glowColor}`,
        }}
      />

      {/* 21st.dev Staggered Orbital Spinner Rays */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 flex items-start justify-center"
          style={{
            transform: `rotate(${i * 60}deg)`,
            animation: "luxurySpin 1.6s cubic-bezier(0.5, 0, 0.5, 1) infinite",
            animationDelay: `${i * 120}ms`,
          }}
        >
          <div
            style={{
              backgroundColor: color,
              width: barWidth,
              height: barHeight,
              borderRadius: "9999px",
              boxShadow: `0 0 8px ${color}80`,
              opacity: 0.35 + (i / 6) * 0.65,
            }}
          />
        </div>
      ))}

      {/* Center Fragrance Droplet / Gem */}
      {showDroplet && (
        <div
          className="relative z-10 rounded-full animate-pulse"
          style={{
            width: `${Math.max(size * 0.16, 6)}px`,
            height: `${Math.max(size * 0.16, 6)}px`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}, inset 0 1px 2px rgba(255,255,255,0.4)`,
          }}
        />
      )}

      <style jsx>{`
        @keyframes luxurySpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default LuxuryLoader;
