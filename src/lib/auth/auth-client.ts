export const AUTH_TOKEN_KEY = "admin_auth_token";

export const authClient = {
  getToken(): string | null {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(AUTH_TOKEN_KEY);
      } catch {
        return null;
      }
    }
    return null;
  },
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      } catch {
        // Fallback for storage restrictions
      }
    }
  },
  clearToken(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      } catch {
        // Fallback
      }
    }
  },
  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};
