class AppConfig {
  static readonly apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  static readonly authCookieName = "nova-rio-auth";
  static readonly agendaPageSize = 6;
  // Vindi public (publishable) key + API base for client-side card tokenization.
  // Card data is tokenized directly against Vindi from the browser — never sent to our backend.
  static readonly vindiApiUrl =
    process.env.NEXT_PUBLIC_VINDI_API_URL ?? "https://app.vindi.com.br/api/v1";
  static readonly vindiPublicKey = process.env.NEXT_PUBLIC_VINDI_PUBLIC_KEY ?? "";
}

export { AppConfig };
