import type { ErrorEvent, Log } from "@sentry/nextjs";

/**
 * `beforeSend`/`beforeSendLog` hooks: strip credentials and query strings from
 * everything the SDK ships.
 *
 * This app handles CPF, card and client data, and those values reach Sentry
 * through page URLs, fetch breadcrumbs, exception messages, console arguments
 * and log messages long before anyone thinks to redact them.
 */
export class SentryEventSanitizer {
  private constructor() {}

  private static readonly droppedHeaders = ["authorization", "cookie", "set-cookie", "x-api-key"];

  static sanitize(event: ErrorEvent): ErrorEvent {
    if (event.message) {
      event.message = SentryEventSanitizer.sanitizeText(event.message);
    }

    for (const value of event.exception?.values ?? []) {
      if (value.value) {
        value.value = SentryEventSanitizer.sanitizeText(value.value);
      }
    }

    for (const breadcrumb of event.breadcrumbs ?? []) {
      if (breadcrumb.message) {
        breadcrumb.message = SentryEventSanitizer.sanitizeText(breadcrumb.message);
      }
      if (breadcrumb.data) {
        breadcrumb.data = SentryEventSanitizer.sanitizeValue(
          breadcrumb.data,
        ) as typeof breadcrumb.data;
      }
    }

    const request = event.request;

    if (!request) {
      return event;
    }

    if (request.headers) {
      for (const header of Object.keys(request.headers)) {
        if (SentryEventSanitizer.droppedHeaders.includes(header.toLowerCase())) {
          delete request.headers[header];
        }
      }
    }

    delete request.cookies;
    delete request.query_string;
    delete request.data;

    if (request.url) {
      const [path] = request.url.split("?");
      request.url = path;
    }

    return event;
  }

  /**
   * Console output is shipped as structured logs, and those never reach
   * `beforeSend`: they need their own pass.
   */
  static sanitizeLog(log: Log): Log {
    if (typeof log.message === "string") {
      log.message = SentryEventSanitizer.sanitizeText(log.message);
    }

    if (log.attributes) {
      log.attributes = SentryEventSanitizer.sanitizeValue(log.attributes) as typeof log.attributes;
    }

    return log;
  }

  /** Walks arrays and plain objects so nested console arguments get the same pass. */
  static sanitizeValue(value: unknown): unknown {
    if (typeof value === "string") {
      return SentryEventSanitizer.sanitizeText(value);
    }

    if (Array.isArray(value)) {
      return value.map((item) => SentryEventSanitizer.sanitizeValue(item));
    }

    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, SentryEventSanitizer.sanitizeValue(item)]),
      );
    }

    return value;
  }

  /**
   * Drops the query string of every URL in a free-form text: `?search=` and
   * friends carry names, e-mails and CPFs straight into the issue title.
   */
  static sanitizeText(text: string): string {
    return text
      .split(" ")
      .map((token) =>
        token.includes("?") && (token.includes("/") || token.includes("://"))
          ? (token.split("?")[0] ?? token)
          : token,
      )
      .join(" ");
  }
}
