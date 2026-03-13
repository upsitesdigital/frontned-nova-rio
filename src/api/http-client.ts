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

async function httpAuthGet<T>(path: string, token: string): Promise<T> {
  const auth = getAuthProvider();
  const latestToken = auth.getAccessToken() ?? token;

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
  const auth = getAuthProvider();
  const latestToken = auth.getAccessToken() ?? token;

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

async function httpAuthPatchWithBody<T>(path: string, body: unknown, token: string): Promise<T> {
  const auth = getAuthProvider();
  const latestToken = auth.getAccessToken() ?? token;

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${latestToken}`,
    },
    body: JSON.stringify(body),
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
      body: JSON.stringify(body),
    });

    if (!retryResponse.ok) {
      const errorBody = await retryResponse.json().catch(() => null);
      const message =
        errorBody && typeof errorBody === "object" && "message" in errorBody
          ? String(errorBody.message)
          : `PATCH ${path} failed: ${retryResponse.statusText}`;
      throw new HttpClientError(retryResponse.status, message);
    }

    return retryResponse.json() as Promise<T>;
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody && typeof errorBody === "object" && "message" in errorBody
        ? String(errorBody.message)
        : `PATCH ${path} failed: ${response.statusText}`;
    throw new HttpClientError(response.status, message);
  }

  return response.json() as Promise<T>;
}

async function httpAuthPatch(path: string, token: string): Promise<void> {
  const auth = getAuthProvider();
  const latestToken = auth.getAccessToken() ?? token;

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

async function httpAuthDelete<T>(path: string, token: string): Promise<T> {
  const auth = getAuthProvider();
  const latestToken = auth.getAccessToken() ?? token;

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${latestToken}`,
    },
  });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      throw new HttpClientError(401, `DELETE ${path} failed: Unauthorized`);
    }

    const retryResponse = await fetch(`${appConfig.apiBaseUrl}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
      },
    });

    if (!retryResponse.ok) {
      throw new HttpClientError(
        retryResponse.status,
        `DELETE ${path} failed: ${retryResponse.statusText}`,
      );
    }

    if (retryResponse.status === 204 || retryResponse.headers.get("content-length") === "0") {
      return undefined as T;
    }
    return retryResponse.json() as Promise<T>;
  }

  if (!response.ok) {
    throw new HttpClientError(response.status, `DELETE ${path} failed: ${response.statusText}`);
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export {
  httpGet,
  httpPost,
  httpAuthGet,
  httpAuthPost,
  httpAuthPatch,
  httpAuthPatchWithBody,
  httpAuthDelete,
  configureAuthProvider,
  HttpClientError,
  type AuthProvider,
};
