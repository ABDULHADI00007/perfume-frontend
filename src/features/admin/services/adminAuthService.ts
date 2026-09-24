import { apiClient } from "@/lib/api/client";
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
    const response = await apiClient<ApiResponse<LoginResponseData>>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    return response.data?.user || (response.data as unknown as AdminUser);
  },

  async getMe(): Promise<AdminUser> {
    const response = await apiClient<ApiResponse<AdminUser>>("/auth/me", {
      method: "GET",
    });
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient<ApiResponse<unknown>>("/auth/logout", {
        method: "POST",
      });
    } catch {
      // Best effort on backend cookie clear
    }
  },
};
