import { apiClient } from "@/lib/api/client";
import { authClient } from "@/lib/auth/auth-client";
import { AdminUser, ApiResponse } from "../types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: AdminUser;
  token?: string;
}

export const adminAuthService = {
  async login(credentials: LoginCredentials): Promise<AdminUser> {
    // 1. Call Next.js server-side proxy which sets local first-party cookies and extracts token
    let response: Response;
    try {
      response = await fetch("/api/admin-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
    } catch {
      // Fallback to direct backend call if Next.js API route is unreachable
      const direct = await apiClient<ApiResponse<LoginResponseData>>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      if (direct.data?.token) {
        authClient.setToken(direct.data.token);
      }
      return direct.data?.user || (direct.data as unknown as AdminUser);
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Invalid email or password");
    }

    const token = data.data?.token;
    if (token) {
      authClient.setToken(token);
    }

    return data.data?.user || (data.data as unknown as AdminUser);
  },

  async getMe(): Promise<AdminUser> {
    const response = await apiClient<ApiResponse<AdminUser>>("/auth/me", {
      method: "GET",
    });
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await fetch("/api/admin-auth/logout", { method: "POST" });
    } catch {
      // Best effort
    }

    try {
      await apiClient<ApiResponse<unknown>>("/auth/logout", {
        method: "POST",
      });
    } catch {
      // Best effort
    } finally {
      authClient.clearToken();
    }
  },
};
