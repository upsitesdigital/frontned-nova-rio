import creditCardType from "credit-card-type";
import type { DsCreditCardBrand } from "@/design-system/data-display";

function normalizeBrand(brand: string): DsCreditCardBrand {
  const lower = brand.toLowerCase();
  if (lower === "visa") return "visa";
  if (lower === "mastercard") return "mastercard";
  return "other";
}

function getDetectedBrandLabel(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, "");
  if (digits.length < 2) return "";
  const detected = creditCardType(digits);
  if (detected.length === 0) return "";
  return detected[0].niceType;
}

export { normalizeBrand, getDetectedBrandLabel };
