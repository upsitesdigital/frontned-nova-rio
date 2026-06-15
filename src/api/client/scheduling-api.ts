import type { CoverageResult, TimeSlot } from "@/types/scheduling";

import { HttpClient } from "@/api/core/http-client";

class SchedulingApi {
  static fetchTimeSlots(date: string): Promise<TimeSlot[]> {
    return HttpClient.get<TimeSlot[]>(`/scheduling/time-slots?date=${date}`);
  }

  static fetchCoverageByCep(cep: string): Promise<CoverageResult> {
    const cleanCep = cep.replace(/\D/g, "");
    return HttpClient.get<CoverageResult>(`/units/validate-coverage?cep=${cleanCep}`);
  }
}

export { SchedulingApi };
