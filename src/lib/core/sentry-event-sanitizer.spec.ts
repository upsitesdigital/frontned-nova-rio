import { describe, it, expect } from "vitest";
import type { ErrorEvent, Log } from "@sentry/nextjs";
import { SentryEventSanitizer } from "./sentry-event-sanitizer";

describe("SentryEventSanitizer", () => {
  it("drops credentials, body and query string from the request", () => {
    const event = {
      request: {
        url: "https://app.novario.com.br/clientes?search=52998224725",
        headers: { Authorization: "Bearer secret", Cookie: "session=abc", "x-trace": "keep-me" },
        cookies: { session: "abc" },
        query_string: "search=52998224725",
        data: { password: "hunter2" },
      },
    } as unknown as ErrorEvent;

    const sanitized = SentryEventSanitizer.sanitize(event);

    expect(sanitized.request?.url).toBe("https://app.novario.com.br/clientes");
    expect(sanitized.request?.headers).toEqual({ "x-trace": "keep-me" });
    expect(sanitized.request?.cookies).toBeUndefined();
    expect(sanitized.request?.query_string).toBeUndefined();
    expect(sanitized.request?.data).toBeUndefined();
  });

  it("drops the query string from fetch breadcrumbs", () => {
    const event = {
      breadcrumbs: [
        {
          category: "fetch",
          data: { url: "https://api.novario.com.br/clients?search=joao@example.com" },
          message: "GET https://api.novario.com.br/clients?search=joao@example.com",
        },
      ],
    } as unknown as ErrorEvent;

    const [breadcrumb] = SentryEventSanitizer.sanitize(event).breadcrumbs ?? [];

    expect(breadcrumb?.data?.url).toBe("https://api.novario.com.br/clients");
    expect(breadcrumb?.message).toBe("GET https://api.novario.com.br/clients");
  });

  it("drops the query string from a log message and its attributes", () => {
    const log = {
      level: "error",
      message: "GET /clientes?search=52998224725 -> boom",
      attributes: { "sentry.message.parameter.0": "at /clientes?search=52998224725" },
    } as unknown as Log;

    const sanitized = SentryEventSanitizer.sanitizeLog(log);

    expect(sanitized.message).toBe("GET /clientes -> boom");
    expect(sanitized.attributes?.["sentry.message.parameter.0"]).toBe("at /clientes");
  });

  it("leaves an event without request data untouched", () => {
    const event = { message: "widget crashed" } as ErrorEvent;

    expect(SentryEventSanitizer.sanitize(event)).toBe(event);
  });

  it("leaves ordinary words with a question mark alone", () => {
    expect(SentryEventSanitizer.sanitizeText("quem? ninguem")).toBe("quem? ninguem");
  });

  it("drops the query string of a URL embedded in a JSON payload", () => {
    const payload = '{"path":"/clientes?search=52998224725"}';

    expect(SentryEventSanitizer.sanitizeText(payload)).toBe('{"path":"/clientes');
  });

  it("drops the query string from exception messages", () => {
    const event = {
      exception: { values: [{ value: "Failed to fetch /clients?search=52998224725" }] },
    } as unknown as ErrorEvent;

    expect(SentryEventSanitizer.sanitize(event).exception?.values?.[0]?.value).toBe(
      "Failed to fetch /clients",
    );
  });

  it("drops the query string from console breadcrumb arguments", () => {
    const event = {
      breadcrumbs: [
        {
          category: "console",
          message: "boom /clientes?search=52998224725",
          data: { arguments: ["boom /clientes?search=52998224725"] },
        },
      ],
    } as unknown as ErrorEvent;

    const [breadcrumb] = SentryEventSanitizer.sanitize(event).breadcrumbs ?? [];

    expect(breadcrumb?.message).toBe("boom /clientes");
    expect(breadcrumb?.data?.arguments).toEqual(["boom /clientes"]);
  });
});
