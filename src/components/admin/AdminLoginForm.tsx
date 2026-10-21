"use client";

import React, { useState } from "react";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";

export const AdminLoginForm: React.FC = () => {
  const { login, isLoading, error } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter both administrative email and password");
      return;
    }

    try {
      await login({ email: email.trim(), password: password.trim() });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setLocalError(msg);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#D4ADFC]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-[0_20px_50px_rgba(18,23,53,0.06)] relative z-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0C134F] text-[#D4ADFC] mx-auto flex items-center justify-center shadow-md">
            <span className="font-serif font-bold text-xl">S</span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400 font-bold block mb-1">
              SOULMATE SCENTS • ADMIN PORTAL
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0C134F]">
              Welcome Back
            </h1>
          </div>

          <p className="text-xs text-slate-500 font-sans leading-relaxed max-w-xs mx-auto">
            Sign in with verified staff credentials to manage the luxury fragrance house.
          </p>
        </div>

        {(localError || error) && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Icons.AlertCircle size={15} className="shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="admin-email"
            label="Administrative Email"
            type="email"
            placeholder="admin@soulmatescents.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={isLoading}
            className="rounded-xl"
          />

          <Input
            id="admin-password"
            label="Secure Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isLoading}
            className="rounded-xl"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2 bg-[#0C134F] hover:bg-[#121A4B] text-white rounded-xl py-3 text-xs font-bold tracking-wider uppercase shadow-md hover:shadow-lg transition-all"
          >
            Sign In to Dashboard
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-mono">
            Protected Administrative Area • SSL Encrypted
          </p>
        </div>
      </div>
    </div>
  );
};
