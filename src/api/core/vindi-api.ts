import { AppConfig } from "@/config/app";

interface VindiTokenizeInput {
  cardNumber: string;
  cardCvv: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  brand: string;
}

interface VindiTokenizeResult {
  gatewayToken: string;
}

class VindiApi {
  // Maps our internal brand labels to Vindi `payment_company_code` values.
  private static readonly companyCode: Record<string, string> = {
    VISA: "visa",
    MASTERCARD: "mastercard",
    AMEX: "american_express",
    ELO: "elo",
    HIPERCARD: "hipercard",
    DINERS: "diners_club",
    DISCOVER: "discover",
    JCB: "jcb",
  };

  private static toCompanyCode(brand: string): string {
    return VindiApi.companyCode[brand] ?? brand.toLowerCase();
  }

  private static encodeBasicAuth(publicKey: string): string {
    const raw = `${publicKey}:`;
    if (typeof btoa === "function") return btoa(raw);
    return Buffer.from(raw).toString("base64");
  }

  /**
   * Tokenizes raw card data directly against Vindi's public API from the browser.
   * The PAN/CVV NEVER touch our own backend — only the resulting gateway token is
   * later persisted via the backend `addCard` call. Keeps the app out of PCI scope.
   */
  static async tokenizeCardWithVindi(input: VindiTokenizeInput): Promise<VindiTokenizeResult> {
    if (!AppConfig.vindiPublicKey) {
      throw new Error("Vindi public key is not configured (NEXT_PUBLIC_VINDI_PUBLIC_KEY).");
    }

    const response = await fetch(`${AppConfig.vindiApiUrl}/public/payment_profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${VindiApi.encodeBasicAuth(AppConfig.vindiPublicKey)}`,
      },
      body: JSON.stringify({
        holder_name: input.holderName,
        card_expiration: `${String(input.expiryMonth).padStart(2, "0")}/${input.expiryYear}`,
        card_number: input.cardNumber,
        card_cvv: input.cardCvv,
        payment_method_code: "credit_card",
        payment_company_code: VindiApi.toCompanyCode(input.brand),
      }),
    });

    if (!response.ok) {
      throw new Error(`Vindi tokenization failed with status ${response.status}`);
    }

    const data = (await response.json()) as { payment_profile?: { gateway_token?: string } };
    const gatewayToken = data.payment_profile?.gateway_token;

    if (!gatewayToken) {
      throw new Error("Vindi tokenization response did not include a gateway token.");
    }

    return { gatewayToken };
  }
}

export { VindiApi, type VindiTokenizeInput, type VindiTokenizeResult };
