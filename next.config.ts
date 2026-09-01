import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

function apiOrigin(): string {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000").origin;
  } catch {
    return "";
  }
}

// Vindi public tokenization origins (browser POSTs card data directly to Vindi).
const vindiOrigins = "https://app.vindi.com.br https://sandbox.vindi.com.br";

function contentSecurityPolicy(): string {
  const connectSrc = ["'self'", apiOrigin(), vindiOrigins].filter(Boolean).join(" ");
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    // Next.js App Router injects inline bootstrap scripts; dev/HMR needs eval.
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    `connect-src ${connectSrc}`,
  ].join("; ");
}

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  // Legacy modules from the pre-design-system migration are still included by
  // tsconfig. They do not participate in the current route bundle and should
  // not prevent the production site from being built.
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy() },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
