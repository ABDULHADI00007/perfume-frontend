"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AdminPermission, AdminRole, AdminUser } from "../types";
import { adminAuthService, LoginCredentials } from "../services/adminAuthService";
import { authClient } from "@/lib/auth/auth-client";
import { hasPermission as checkPermission } from "../permissions";

export interface AdminAuthContextType {
  user: AdminUser | null;
  role: AdminRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasPermission: (permission: AdminPermission) => boolean;
  login: (credentials: LoginCredentials) => Promise<AdminUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = "ss_admin_profile";

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous hydration from cached profile for 0ms instantaneous load
  const [user, setUser] = useState<AdminUser | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (saved && authClient.getToken()) {
          return JSON.parse(saved);
        }
      } catch {}
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (saved && authClient.getToken()) {
          return false; // Skip blocking skeleton if already authenticated!
        }
      } catch {}
    }
    return true;
  });

  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async (isInitial = false) => {
    try {
      // Only show full skeleton if we don't already have an active profile
      if (isInitial && !authClient.getToken()) {
        setIsLoading(true);
      }
      setError(null);
      const profile = await adminAuthService.getMe();
      setUser(profile);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        } catch {}
      }
    } catch {
      setUser(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(PROFILE_STORAGE_KEY);
        } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser(true);

    const handleUnauthorized = () => {
      setUser(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(PROFILE_STORAGE_KEY);
        } catch {}
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:unauthorized", handleUnauthorized);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:unauthorized", handleUnauthorized);
      }
    };
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials): Promise<AdminUser> => {
    try {
      setIsLoading(true);
      setError(null);
      const authenticatedUser = await adminAuthService.login(credentials);
      setUser(authenticatedUser);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(authenticatedUser));
        } catch {}
      }
      return authenticatedUser;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await adminAuthService.logout();
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(PROFILE_STORAGE_KEY);
        } catch {}
      }
      setIsLoading(false);
    }
  };

  const hasPermissionFn = useCallback(
    (permission: AdminPermission) => {
      return checkPermission(user?.role, permission);
    },
    [user?.role]
  );

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        isLoading,
        error,
        hasPermission: hasPermissionFn,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
