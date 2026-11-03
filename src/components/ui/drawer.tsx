"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "./icons";
import { drawerVariants, drawerLeftVariants, overlayVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: "right" | "left";
  maxWidth?: "sm" | "md" | "lg";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  position = "right",
  maxWidth = "md",
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const titleId = title ? "drawer-title" : undefined;
  const descriptionId = description ? "drawer-description" : undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="fixed inset-0 z-drawer overflow-hidden"
        >
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
          />

          <div
            className={cn(
              "fixed inset-y-0 max-w-full flex",
              position === "left" ? "left-0 pr-4 sm:pr-10" : "right-0 pl-4 sm:pl-10"
            )}
          >
            <motion.div
              variants={position === "left" ? drawerLeftVariants : drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "w-screen bg-surface shadow-modal flex flex-col",
                maxWidthMap[maxWidth],
                position === "left" ? "border-r border-border" : "border-l border-border"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border-subtle">
                <div>
                  {title && (
                    <h2
                      id={titleId}
                      className="font-serif text-xl sm:text-2xl font-bold text-black leading-tight"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id={descriptionId}
                      className="text-xs text-[#64748B] mt-1 font-sans font-medium"
                    >
                      {description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="p-2 text-[#64748B] hover:text-[#590B16] transition-colors focus-visible:outline-none"
                >
                  <Icons.Close size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="p-4 sm:p-6 border-t border-border-subtle bg-surface-subtle/30">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
