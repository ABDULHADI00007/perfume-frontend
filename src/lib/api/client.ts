import { env } from "@/config/environment";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  /** Timeout in milliseconds. Defaults to 5000ms on server, 10000ms on client. */
  timeout?: number;
}

/** Default timeout: 1000ms for SSR (to prevent page render blocking), 10000ms for client */
const DEFAULT_TIMEOUT_MS = typeof window === "undefined" ? 1000 : 10000;

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, timeout, ...customConfig } = options;

  let url = `${env.apiUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutMs = timeout ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const config: RequestInit = {
    method: customConfig.method || "GET",
    credentials: "include",
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let message =
        errorData.message ||
        errorData.error ||
        (Array.isArray(errorData.errors) ? errorData.errors[0]?.message : undefined);

      if (!message) {
        if (response.status === 429) {
          message = "Too many requests. Please wait a moment before trying again.";
        } else if (response.status >= 500) {
          message = "Something went wrong on our servers. Please try again shortly.";
        } else if (response.status === 403) {
          message = "You do not have permission to perform this action.";
        } else if (response.status === 404) {
          message = "The requested resource could not be found.";
        } else {
          message = `Request failed with status ${response.status}.`;
        }
      }

      const error = new Error(message) as Error & { status?: number; data?: unknown };
      error.status = response.status;
      error.data = errorData;

      // Trigger session reset on 401 Unauthorized (unless attempting login)
      if (response.status === 401 && !endpoint.includes("/auth/login") && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }

      throw error;
    }

    return response.json();
  } catch (err) {
    // Handle abort/timeout errors
    if (err instanceof Error && err.name === "AbortError") {
      const timeoutError = new Error(
        "Request timed out. The server took too long to respond."
      ) as Error & { status?: number };
      timeoutError.status = 408;
      throw timeoutError;
    }
    if (err instanceof Error && err.name === "TypeError" && err.message.includes("fetch")) {
      const networkError = new Error(
        "Unable to connect to Maison de Parfum. Please check your internet connection."
      ) as Error & { status?: number };
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

