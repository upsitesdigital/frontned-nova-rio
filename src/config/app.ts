const appConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://207.244.229.247:4000",
} as const;

export { appConfig };
