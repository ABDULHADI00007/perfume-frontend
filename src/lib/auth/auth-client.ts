export const AUTH_TOKEN_KEY = "admin_auth_token";

export const authClient = {
  getToken(): string | null {
    // Authentication tokens are stored strictly in secure HTTP-only cookies by the backend.
    // Client-side code does not access or manage token strings directly.
    return null;
  },
  setToken(): void {
    // Cookie creation is managed authoritatively by the backend Set-Cookie response header.
  },
  clearToken(): void {
    // Cookie clearing is handled authoritatively by POST /api/v1/auth/logout.
  },
  isAuthenticated(): boolean {
    return true;
  },
};
