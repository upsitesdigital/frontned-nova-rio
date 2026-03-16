import { removeCard } from "@/api/cards-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface RemoveCardResult {
  success: boolean;
  error: string | null;
}

async function removeClientCard(cardId: number): Promise<RemoveCardResult> {
  try {
    await removeCard(cardId);
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.cards.removeError),
    };
  }
}

export { removeClientCard, type RemoveCardResult };
