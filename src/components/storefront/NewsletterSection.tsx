"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      aria-label="Newsletter Subscription"
      className="py-20 sm:py-28 bg-primary text-primary-foreground relative overflow-hidden border-b border-border/10"
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <Container size="narrow" className="relative z-10">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          {/* Eyebrow */}
          <motion.div variants={staggerItem} className="inline-flex items-center justify-center space-x-3 mb-6">
            <span className="w-8 h-[1px] bg-champagne/60" />
            <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-champagne/80">
              Private Correspondence
            </span>
            <span className="w-8 h-[1px] bg-champagne/60" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={staggerItem}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight tracking-tight mb-4"
          >
            Join the Inner Circle
          </motion.h2>

          {/* Supporting Text */}
          <motion.p
            variants={staggerItem}
            className="text-sm sm:text-base text-white/60 font-sans font-light leading-relaxed max-w-lg mx-auto mb-10"
          >
            Receive early access to private reserve releases, invitations to exclusive olfactory events, and curated seasonal dispatches from our atelier.
          </motion.p>

          {/* Form */}
          <motion.div variants={staggerItem} className="max-w-md mx-auto">
            {status === "success" ? (
              <div className="flex items-center justify-center gap-3 p-5 border border-champagne/30 bg-champagne/5">
                <Icons.Check size={18} className="text-champagne" />
                <p className="text-sm text-white/80 font-sans font-light">
                  Welcome to the inner circle. A correspondence awaits.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="inner-circle-email" className="sr-only">
                    Email Address
                  </label>
                  <input
                    id="inner-circle-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder="Your email address..."
                    disabled={status === "loading"}
                    className={`w-full bg-white/5 text-white/90 text-sm px-4 py-3.5 border focus:outline-none font-sans placeholder:text-white/30 transition-colors duration-200 ${
                      status === "error"
                        ? "border-red-400/50 focus:border-red-400"
                        : "border-white/15 focus:border-champagne/60"
                    }`}
                  />
                  {status === "error" && (
                    <p className="text-xs text-red-400/80 mt-1.5 text-left font-sans">
                      Please enter a valid email address.
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center font-sans font-medium uppercase px-7 py-3.5 text-xs tracking-[0.18em] bg-champagne text-navy hover:bg-accent-hover transition-colors duration-200 cursor-pointer whitespace-nowrap disabled:opacity-50"
                >
                  {status === "loading" ? "Joining..." : "Join"}
                </button>
              </form>
            )}

            {/* Privacy Note */}
            <p className="text-[10px] text-white/25 mt-4 font-sans">
              We send only what matters. No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
