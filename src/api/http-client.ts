import { appConfig } from "@/config/app";

class HttpClientError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpClientError";
  }
}

async function httpGet<T>(path: string): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new HttpClientError(response.status, `GET ${path} failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function httpPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody && typeof errorBody === "object" && "message" in errorBody
        ? String(errorBody.message)
        : `POST ${path} failed: ${response.statusText}`;
    throw new HttpClientError(response.status, message);
  }

  return response.json() as Promise<T>;
}

export { httpGet, httpPost, HttpClientError };
