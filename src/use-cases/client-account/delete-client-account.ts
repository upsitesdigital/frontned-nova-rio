import { ProfileApi } from "@/api/client/profile-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

type DeleteAccountResult = { success: true } | { success: false; error: string };

class DeleteClientAccount {
  static async removeClientAccount(phrase: string): Promise<DeleteAccountResult> {
    try {
      await ProfileApi.deleteClientAccount(phrase);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.profile.deleteError),
      };
    }
  }
}

export { DeleteClientAccount, type DeleteAccountResult };
