import { fetchTimeSlots } from "@/api/scheduling-api";
import { MESSAGES } from "@/lib/messages";
import type { TimeSlot } from "@/types/scheduling";

interface TimeSlotsResult {
  data: TimeSlot[] | null;
  error: string | null;
}

async function loadTimeSlots(date: string): Promise<TimeSlotsResult> {
  try {
    const data = await fetchTimeSlots(date);
    return { data, error: null };
  } catch {
    return { data: null, error: MESSAGES.scheduling.loadTimeSlotsError };
  }
}

export { loadTimeSlots, type TimeSlotsResult };
