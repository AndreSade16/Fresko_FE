import { toast } from "react-toastify";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  let body = options.body;

  if (!(body instanceof FormData)) {
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
    if (body && typeof body === "object") {
      body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
    body,
  });

  if (!response.ok) {
    let errorMessage: string;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || JSON.stringify(errorData);
    } catch {
      errorMessage = await response.text();
    }

    if (
      response.status === 500 &&
      (errorMessage.includes("Error with token") ||
        errorMessage.includes("try a new login"))
    ) {
      localStorage.removeItem("accessToken");
      window.dispatchEvent(new Event("unauthorized_logout"));
      toast.error("Error with credentials. Log in again");
    }

    throw new Error(errorMessage || `HTTP Error: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
