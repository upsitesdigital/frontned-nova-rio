import { ProfileApi, type RecurrenceFrequencyCode } from "@/api/client/profile-api";

class RecurrencePreference {
  static async load(): Promise<RecurrenceFrequencyCode | null> {
    try {
      const profile = await ProfileApi.fetchClientProfile();
      return profile.preferredRecurrence;
    } catch {
      return null;
    }
  }

  static async save(code: RecurrenceFrequencyCode): Promise<boolean> {
    try {
      await ProfileApi.updateClientProfile({ preferredRecurrence: code });
      return true;
    } catch {
      return false;
    }
  }
}

export { RecurrencePreference };
