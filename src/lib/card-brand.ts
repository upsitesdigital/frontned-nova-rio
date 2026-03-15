import creditCardType from "credit-card-type";

const BRAND_MAP: Record<string, string> = {
  visa: "VISA",
  mastercard: "MASTERCARD",
  "american-express": "AMEX",
  elo: "ELO",
  hipercard: "HIPERCARD",
  "diners-club": "DINERS",
  discover: "DISCOVER",
  jcb: "JCB",
};

function detectCardBrand(digits: string): string {
  const results = creditCardType(digits);
  if (results.length === 0) return "UNKNOWN";
  return BRAND_MAP[results[0].type] ?? results[0].type.toUpperCase();
}

export { detectCardBrand, BRAND_MAP };
