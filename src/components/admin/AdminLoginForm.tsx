"use client";

import React, { useState } from "react";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const AdminLoginForm: React.FC = () => {
  const { login, isLoading, error } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter both email and password");
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
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-surface border border-border p-8 sm:p-10 shadow-card relative">
        <div className="text-center mb-8">
          <div className="w-8 h-[1px] bg-accent mx-auto mb-4" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#6B6F80] font-semibold block mb-2">
            Soulmate Scents • Admin
          </span>
          <h1 className="font-serif text-3xl text-[#121735] font-normal tracking-wide">
            Administrative Portal
          </h1>
          <p className="text-xs text-[#6B6F80] mt-2 font-sans leading-relaxed">
            Please authenticate with your administrative credentials to access management controls.
          </p>
        </div>

        {(localError || error) && (
          <div className="mb-6 p-3.5 bg-[#FDF2F2] border border-[#9E2A2B]/20 text-[#9E2A2B] text-xs font-medium rounded-lg">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="admin-email"
            label="Email Address"
            type="email"
            placeholder="admin@soulmatescents.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            id="admin-password"
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Sign In to Dashboard
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border-subtle text-center text-[10px] uppercase tracking-[0.16em] text-foreground-subtle">
          Protected Administrative Area • Confidential
        </div>
      </div>
    </div>
  );
};

