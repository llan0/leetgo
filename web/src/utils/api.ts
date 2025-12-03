/**
 * Get API base URL based on environment
 * In production, use empty string (same origin) or VITE_API_URL if set
 * In development (port 3001), use localhost:3000
 */
export function getApiBase(): string {
  if (typeof window === "undefined") return "";

  // Check for environment variable (set at build time)
  const envApiUrl = (window as any).__API_BASE_URL__;
  if (envApiUrl) return envApiUrl;

  // Development mode (Bun dev server on 3001)
  if (window.location.port === "3001") {
    return "http://localhost:3000";
  }

  // Production: same origin
  return "";
}

export const API_BASE = getApiBase();


