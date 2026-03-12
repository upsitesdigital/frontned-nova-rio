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

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshToken(): Promise<string | null> {
  const { useAuthStore } = await import("@/stores/auth-store");
  const { refreshToken } = useAuthStore.getState();

  if (!refreshToken) {
    useAuthStore.getState().reset();
    return null;
  }

  try {
    const response = await fetch(`${appConfig.apiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      useAuthStore.getState().reset();
      return null;
    }

    const tokens = (await response.json()) as { accessToken: string; refreshToken: string };
    useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
  } catch {
    useAuthStore.getState().reset();
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

async function httpAuthGet<T>(path: string, token: string): Promise<T> {
  const { useAuthStore } = await import("@/stores/auth-store");
  const latestToken = useAuthStore.getState().accessToken ?? token;

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${latestToken}`,
    },
  });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      throw new HttpClientError(401, `GET ${path} failed: Unauthorized`);
    }

    const retryResponse = await fetch(`${appConfig.apiBaseUrl}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
      },
    });

    if (!retryResponse.ok) {
      throw new HttpClientError(
        retryResponse.status,
        `GET ${path} failed: ${retryResponse.statusText}`,
      );
    }

    return retryResponse.json() as Promise<T>;
  }

  if (!response.ok) {
    throw new HttpClientError(response.status, `GET ${path} failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function httpAuthPost<T>(path: string, body: unknown, token: string): Promise<T> {
  const { useAuthStore } = await import("@/stores/auth-store");
  const latestToken = useAuthStore.getState().accessToken ?? token;

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${latestToken}`,
    },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      throw new HttpClientError(401, `POST ${path} failed: Unauthorized`);
    }

    const retryResponse = await fetch(`${appConfig.apiBaseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!retryResponse.ok) {
      const errorBody = await retryResponse.json().catch(() => null);
      const message =
        errorBody && typeof errorBody === "object" && "message" in errorBody
          ? String(errorBody.message)
          : `POST ${path} failed: ${retryResponse.statusText}`;
      throw new HttpClientError(retryResponse.status, message);
    }

    return retryResponse.json() as Promise<T>;
  }

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

async function httpAuthPatch(path: string, token: string): Promise<void> {
  const { useAuthStore } = await import("@/stores/auth-store");
  const latestToken = useAuthStore.getState().accessToken ?? token;

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${latestToken}`,
    },
  });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      throw new HttpClientError(401, `PATCH ${path} failed: Unauthorized`);
    }

    const retryResponse = await fetch(`${appConfig.apiBaseUrl}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
      },
    });

    if (!retryResponse.ok) {
      throw new HttpClientError(
        retryResponse.status,
        `PATCH ${path} failed: ${retryResponse.statusText}`,
      );
    }

    return;
  }

  if (!response.ok) {
    throw new HttpClientError(response.status, `PATCH ${path} failed: ${response.statusText}`);
  }
}

export { httpGet, httpPost, httpAuthGet, httpAuthPost, httpAuthPatch, HttpClientError };
