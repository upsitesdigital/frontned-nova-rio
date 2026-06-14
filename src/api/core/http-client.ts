import { AppConfig } from "@/config/app";
import { HttpClientError } from "@/lib/auth/http-error";

interface AuthProvider {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getAuthEpoch: () => number;
  setTokens: (accessToken: string, refreshToken: string) => void;
  reset: () => void;
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type NavigatorWithOptionalLocks = Navigator & {
  locks?: {
    request<T>(name: string, callback: () => Promise<T>): Promise<T>;
  };
};

class HttpClient {
  private static authProvider: AuthProvider | null = null;
  private static isRefreshing = false;
  private static refreshPromise: Promise<string | null> | null = null;

  static configureAuthProvider(provider: AuthProvider): void {
    HttpClient.authProvider = provider;
  }

  private static getAuthProvider(): AuthProvider {
    if (!HttpClient.authProvider) {
      throw new HttpClientError(401, "Auth provider not configured");
    }
    return HttpClient.authProvider;
  }

  private static parseErrorBody(errorBody: unknown, fallbackMessage: string): string {
    if (errorBody && typeof errorBody === "object" && "message" in errorBody) {
      return String(errorBody.message);
    }
    return fallbackMessage;
  }

  static async get<T>(path: string): Promise<T> {
    const response = await fetch(`${AppConfig.apiBaseUrl}${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = HttpClient.parseErrorBody(
        errorBody,
        `GET ${path} failed: ${response.statusText}`,
      );
      throw new HttpClientError(response.status, message);
    }

    return response.json() as Promise<T>;
  }

  static async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${AppConfig.apiBaseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = HttpClient.parseErrorBody(
        errorBody,
        `POST ${path} failed: ${response.statusText}`,
      );
      throw new HttpClientError(response.status, message);
    }

    return response.json() as Promise<T>;
  }

  private static async withRefreshLock<T>(callback: () => Promise<T>): Promise<T> {
    if (typeof navigator === "undefined") {
      return callback();
    }

    const locks = (navigator as NavigatorWithOptionalLocks).locks;
    if (!locks) {
      return callback();
    }

    return locks.request("nova-rio-auth-refresh", callback);
  }

  private static async tryRefreshToken(): Promise<string | null> {
    const auth = HttpClient.getAuthProvider();
    const refreshToken = auth.getRefreshToken();
    const authEpoch = auth.getAuthEpoch();

    if (!refreshToken) {
      auth.reset();
      return null;
    }

    try {
      const response = await fetch(`${AppConfig.apiBaseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        auth.reset();
        return null;
      }

      const tokens = (await response.json()) as { accessToken: string; refreshToken: string };
      if (auth.getAuthEpoch() !== authEpoch || !auth.getRefreshToken()) {
        return null;
      }
      auth.setTokens(tokens.accessToken, tokens.refreshToken);
      return tokens.accessToken;
    } catch {
      auth.reset();
      return null;
    }
  }

  private static async refreshAccessToken(): Promise<string | null> {
    if (HttpClient.isRefreshing && HttpClient.refreshPromise) {
      return HttpClient.refreshPromise;
    }

    HttpClient.isRefreshing = true;
    HttpClient.refreshPromise = HttpClient.withRefreshLock(HttpClient.tryRefreshToken).finally(() => {
      HttpClient.isRefreshing = false;
      HttpClient.refreshPromise = null;
    });

    return HttpClient.refreshPromise;
  }

  private static async authRequest<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    signal?: AbortSignal,
    responseParser: (response: Response) => Promise<T> = (r) => r.json() as Promise<T>,
  ): Promise<T> {
    const auth = HttpClient.getAuthProvider();
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

    const parseSuccessResponse = (res: Response): Promise<T> => {
      if (res.status === 204 || res.headers.get("content-length") === "0") {
        return Promise.resolve(undefined as T);
      }
      return responseParser(res);
    };

    const response = await fetch(`${AppConfig.apiBaseUrl}${path}`, buildInit(latestToken));

    if (response.status === 401) {
      const newToken = await HttpClient.refreshAccessToken();

      if (!newToken) {
        throw new HttpClientError(401, `${method} ${path} failed: Unauthorized`);
      }

      const retryResponse = await fetch(`${AppConfig.apiBaseUrl}${path}`, buildInit(newToken));

      if (!retryResponse.ok) {
        const errorBody = await retryResponse.json().catch(() => null);
        const message = HttpClient.parseErrorBody(
          errorBody,
          `${method} ${path} failed: ${retryResponse.statusText}`,
        );
        throw new HttpClientError(retryResponse.status, message);
      }

      return parseSuccessResponse(retryResponse);
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = HttpClient.parseErrorBody(
        errorBody,
        `${method} ${path} failed: ${response.statusText}`,
      );
      throw new HttpClientError(response.status, message);
    }

    return parseSuccessResponse(response);
  }

  static async authGet<T>(path: string, signal?: AbortSignal): Promise<T> {
    return HttpClient.authRequest<T>("GET", path, undefined, signal);
  }

  static async authPost<T>(path: string, body: unknown): Promise<T> {
    return HttpClient.authRequest<T>("POST", path, body);
  }

  static async authPatchWithBody<T>(path: string, body: unknown): Promise<T> {
    return HttpClient.authRequest<T>("PATCH", path, body);
  }

  static async authPatch(path: string): Promise<void> {
    return HttpClient.authRequest<void>("PATCH", path);
  }

  static async authDelete<T>(path: string): Promise<T> {
    return HttpClient.authRequest<T>("DELETE", path);
  }

  static authGetBlob(path: string): Promise<Blob> {
    return HttpClient.authRequest<Blob>("GET", path, undefined, undefined, (r) => r.blob());
  }
}

export { HttpClient, HttpClientError, type AuthProvider };
