const appConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000",
  authCookieName: "nova-rio-auth",
  agendaPageSize: 6,
  // Vindi public (publishable) key + API base for client-side card tokenization.
  // Card data is tokenized directly against Vindi from the browser — never sent to our backend.
  vindiApiUrl: process.env.NEXT_PUBLIC_VINDI_API_URL ?? "https://app.vindi.com.br/api/v1",
  vindiPublicKey: process.env.NEXT_PUBLIC_VINDI_PUBLIC_KEY ?? "",
} as const;

export { appConfig };
