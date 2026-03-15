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

interface AuthProvider {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  reset: () => void;
}

let authProvider: AuthProvider | null = null;

function configureAuthProvider(provider: AuthProvider): void {
  authProvider = provider;
}

function getAuthProvider(): AuthProvider {
  if (!authProvider) {
    throw new HttpClientError(401, "Auth provider not configured");
  }
  return authProvider;
}

function parseErrorBody(errorBody: unknown, fallbackMessage: string): string {
  if (errorBody && typeof errorBody === "object" && "message" in errorBody) {
    return String(errorBody.message);
  }
  return fallbackMessage;
}

async function httpGet<T>(path: string): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = parseErrorBody(errorBody, `GET ${path} failed: ${response.statusText}`);
    throw new HttpClientError(response.status, message);
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
    const message = parseErrorBody(errorBody, `POST ${path} failed: ${response.statusText}`);
    throw new HttpClientError(response.status, message);
  }

  return response.json() as Promise<T>;
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshToken(): Promise<string | null> {
  const auth = getAuthProvider();
  const refreshToken = auth.getRefreshToken();

  if (!refreshToken) {
    auth.reset();
    return null;
  }

  try {
    const response = await fetch(`${appConfig.apiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      auth.reset();
      return null;
    }

    const tokens = (await response.json()) as { accessToken: string; refreshToken: string };
    auth.setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
  } catch {
    auth.reset();
    return null;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = tryRefreshToken().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

async function httpAuthRequest<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const auth = getAuthProvider();
  const latestToken = auth.getAccessToken() ?? "";

  const buildHeaders = (token: string): HeadersInit => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const buildInit = (token: string): RequestInit => {
    const init: RequestInit = {
      method,
      headers: buildHeaders(token),
      signal,
    };
    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }
    return init;
  };

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, buildInit(latestToken));

  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      throw new HttpClientError(401, `${method} ${path} failed: Unauthorized`);
    }

    const retryResponse = await fetch(`${appConfig.apiBaseUrl}${path}`, buildInit(newToken));

    if (!retryResponse.ok) {
      const errorBody = await retryResponse.json().catch(() => null);
      const message = parseErrorBody(
        errorBody,
        `${method} ${path} failed: ${retryResponse.statusText}`,
      );
      throw new HttpClientError(retryResponse.status, message);
    }

    if (retryResponse.status === 204 || retryResponse.headers.get("content-length") === "0") {
      return undefined as T;
    }
    return retryResponse.json() as Promise<T>;
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = parseErrorBody(errorBody, `${method} ${path} failed: ${response.statusText}`);
    throw new HttpClientError(response.status, message);
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

async function httpAuthGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  return httpAuthRequest<T>("GET", path, undefined, signal);
}

async function httpAuthPost<T>(path: string, body: unknown): Promise<T> {
  return httpAuthRequest<T>("POST", path, body);
}

async function httpAuthPatchWithBody<T>(path: string, body: unknown): Promise<T> {
  return httpAuthRequest<T>("PATCH", path, body);
}

async function httpAuthPatch(path: string): Promise<void> {
  return httpAuthRequest<void>("PATCH", path);
}

async function httpAuthDelete<T>(path: string): Promise<T> {
  return httpAuthRequest<T>("DELETE", path);
}

async function httpAuthGetBlob(path: string): Promise<Blob> {
  const auth = getAuthProvider();
  const latestToken = auth.getAccessToken() ?? "";

  const buildHeaders = (token: string): HeadersInit => ({
    Authorization: `Bearer ${token}`,
  });

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: "GET",
    headers: buildHeaders(latestToken),
  });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      throw new HttpClientError(401, `GET ${path} failed: Unauthorized`);
    }

    const retryResponse = await fetch(`${appConfig.apiBaseUrl}${path}`, {
      method: "GET",
      headers: buildHeaders(newToken),
    });

    if (!retryResponse.ok) {
      throw new HttpClientError(
        retryResponse.status,
        `GET ${path} failed: ${retryResponse.statusText}`,
      );
    }

    return retryResponse.blob();
  }

  if (!response.ok) {
    throw new HttpClientError(response.status, `GET ${path} failed: ${response.statusText}`);
  }

  return response.blob();
}

export {
  httpGet,
  httpPost,
  httpAuthGet,
  httpAuthPost,
  httpAuthPatch,
  httpAuthPatchWithBody,
  httpAuthDelete,
  httpAuthGetBlob,
  configureAuthProvider,
  HttpClientError,
  type AuthProvider,
};
