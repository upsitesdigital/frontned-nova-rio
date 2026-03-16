import { tokenizeCard, addCard, type Card, type AddCardRequest } from "@/api/cards-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { detectCardBrand } from "@/lib/card-brand";
import { MESSAGES } from "@/lib/messages";

interface AddCardInput {
  cardNumber: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isDefault: boolean;
}

interface AddCardResult {
  success: boolean;
  card?: Card;
  error: string | null;
}

async function addClientCard(input: AddCardInput): Promise<AddCardResult> {
  const digits = input.cardNumber.replace(/\s/g, "");
  const lastFourDigits = digits.slice(-4);
  const brand = detectCardBrand(digits);
  const expiryMonth = parseInt(input.expiryMonth, 10);
  const expiryYear = parseInt(input.expiryYear, 10);

  try {
    const { gatewayToken } = await tokenizeCard({
      cardNumber: digits,
      cardCvv: input.cvv,
      holderName: input.holderName.toUpperCase(),
      expiryMonth,
      expiryYear,
      brand,
    });

    const data: AddCardRequest = {
      lastFourDigits,
      brand,
      holderName: input.holderName.toUpperCase(),
      expiryMonth,
      expiryYear,
      gatewayToken,
      isDefault: input.isDefault,
    };

    const card = await addCard(data);
    return { success: true, card, error: null };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.cards.addError),
    };
  }
}

export { addClientCard, type AddCardInput, type AddCardResult };
