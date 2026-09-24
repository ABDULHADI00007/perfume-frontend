"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AdminPermission, AdminRole, AdminUser } from "../types";
import { adminAuthService, LoginCredentials } from "../services/adminAuthService";
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

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profile = await adminAuthService.getMe();
      setUser(profile);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    const handleUnauthorized = () => {
      setUser(null);
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
