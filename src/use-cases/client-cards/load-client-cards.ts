import { CardsApi, type Card } from "@/api/client/cards-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface ClientCardsResult {
  data: Card[] | null;
  error: string | null;
}

class LoadClientCards {
  static async loadClientCards(): Promise<ClientCardsResult> {
    try {
      const data = await CardsApi.listCards();
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.cards.loadError),
      };
    }
  }
}

export { LoadClientCards, type ClientCardsResult };
