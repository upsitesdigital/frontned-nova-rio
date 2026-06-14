import { CardsApi } from "@/api/client/cards-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface RemoveCardResult {
  success: boolean;
  error: string | null;
}

class RemoveClientCard {
  static async removeClientCard(cardId: number): Promise<RemoveCardResult> {
    try {
      await CardsApi.removeCard(cardId);
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.cards.removeError),
      };
    }
  }
}

export { RemoveClientCard, type RemoveCardResult };
