const appConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
} as const;

//mudar url após ajustes

export { appConfig };
