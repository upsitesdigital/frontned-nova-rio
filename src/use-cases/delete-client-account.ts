import { deleteClientAccount } from "@/api/profile-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

type DeleteAccountResult =
  | { success: true }
  | { success: false; error: string };

async function removeClientAccount(phrase: string): Promise<DeleteAccountResult> {
  try {
    await deleteClientAccount(phrase);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.profile.deleteError),
    };
  }
}

export { removeClientAccount, type DeleteAccountResult };
