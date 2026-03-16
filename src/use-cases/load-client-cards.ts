import { listCards, type Card } from "@/api/cards-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface ClientCardsResult {
  data: Card[] | null;
  error: string | null;
}

async function loadClientCards(): Promise<ClientCardsResult> {
  try {
    const data = await listCards();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.cards.loadError),
    };
  }
}

export { loadClientCards, type ClientCardsResult };
