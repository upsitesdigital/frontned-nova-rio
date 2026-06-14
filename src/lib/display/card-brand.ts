import creditCardType from "credit-card-type";

class CardBrand {
  static readonly brandMap: Record<string, string> = {
    visa: "VISA",
    mastercard: "MASTERCARD",
    "american-express": "AMEX",
    elo: "ELO",
    hipercard: "HIPERCARD",
    "diners-club": "DINERS",
    discover: "DISCOVER",
    jcb: "JCB",
  };

  static detectCardBrand(digits: string): string {
    const results = creditCardType(digits);
    if (results.length === 0) return "UNKNOWN";
    return CardBrand.brandMap[results[0].type] ?? results[0].type.toUpperCase();
  }
}

export { CardBrand };
