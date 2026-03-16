const appConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
  authCookieName: "nova-rio-auth",
  agendaPageSize: 6,
} as const;

export { appConfig };
