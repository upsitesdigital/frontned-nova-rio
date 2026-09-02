import * as Sentry from "@sentry/nextjs";

import { SentryEventSanitizer } from "@/lib/core/sentry-event-sanitizer";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  enableLogs: true,
  integrations: [Sentry.consoleLoggingIntegration({ levels: ["warn", "error"] })],
  sendDefaultPii: false,
  beforeSend: (event) => SentryEventSanitizer.sanitize(event),
  beforeSendLog: (log) => SentryEventSanitizer.sanitizeLog(log),
});
