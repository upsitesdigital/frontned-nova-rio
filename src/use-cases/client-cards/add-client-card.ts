import { CardsApi, type Card, type AddCardRequest } from "@/api/client/cards-api";
import { VindiApi } from "@/api/core/vindi-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { CardBrand } from "@/lib/display/card-brand";
import { Messages } from "@/lib/core/messages";

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

class AddClientCard {
  static async addClientCard(input: AddCardInput): Promise<AddCardResult> {
    const digits = input.cardNumber.replace(/\s/g, "");
    const lastFourDigits = digits.slice(-4);
    const brand = CardBrand.detectCardBrand(digits);
    const expiryMonth = parseInt(input.expiryMonth, 10);
    const expiryYear = parseInt(input.expiryYear, 10);

    try {
      const { gatewayToken } = await VindiApi.tokenizeCardWithVindi({
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

      const card = await CardsApi.addCard(data);
      return { success: true, card, error: null };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.cards.addError),
      };
    }
  }
}

export { AddClientCard, type AddCardInput, type AddCardResult };
