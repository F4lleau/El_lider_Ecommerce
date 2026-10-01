import type { ApiResponse } from "@/types/api";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000/api").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("No se pudo conectar con la API. Verifica que el backend de QA este activo y que VITE_API_URL apunte a Render.");
  }

  const contentType = response.headers.get("content-type") ?? "";
  const rawBody = await response.text();
  let payload: (ApiResponse<T> & { detail?: string }) | null = null;

  if (rawBody && contentType.includes("application/json")) {
    try {
      payload = JSON.parse(rawBody) as ApiResponse<T> & { detail?: string };
    } catch {
      throw new Error("La API devolvio una respuesta JSON invalida. Revisa los logs del backend QA en Render.");
    }
  }

  if (!payload) {
    const message = rawBody
      ? `La API devolvio una respuesta inesperada (${response.status}).`
      : `La API no devolvio contenido (${response.status}). Puede estar despertando en Render o haber fallado el deploy.`;

    if (!response.ok) {
      throw new Error(message);
    }

    throw new Error("La API devolvio una respuesta vacia.");
  }

  if (!response.ok || !payload.ok) {
    if (response.status === 401 && !path.startsWith("/auth/")) {
      localStorage.removeItem("token");
      localStorage.removeItem("auth-user");
      window.location.assign("/login");
    }
    throw new Error(payload?.detail ? `${payload.message}: ${payload.detail}` : payload?.message ?? "Error inesperado en la API");
  }

  return payload.data;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
