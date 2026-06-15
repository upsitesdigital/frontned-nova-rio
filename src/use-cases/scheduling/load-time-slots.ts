import { SchedulingApi } from "@/api/client/scheduling-api";
import { Messages } from "@/lib/core/messages";
import type { TimeSlot } from "@/types/scheduling";

interface TimeSlotsResult {
  data: TimeSlot[] | null;
  error: string | null;
}

class LoadTimeSlots {
  static async loadTimeSlots(date: string): Promise<TimeSlotsResult> {
    try {
      const data = await SchedulingApi.fetchTimeSlots(date);
      return { data, error: null };
    } catch {
      return { data: null, error: Messages.scheduling.loadTimeSlotsError };
    }
  }
}

export { LoadTimeSlots, type TimeSlotsResult };
