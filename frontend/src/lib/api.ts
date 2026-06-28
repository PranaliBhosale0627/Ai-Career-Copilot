const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "careerco_auth_token";

let unauthorizedHandler: (() => void) | null = null;

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}

export function getAuthToken(): string {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function onUnauthorized(handler: () => void): void {
  unauthorizedHandler = handler;
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(init.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(apiUrl(path), {
    ...init,
    headers
  });

  if (response.status === 401) {
    clearAuthToken();
    unauthorizedHandler?.();
  }

  return response;
}
