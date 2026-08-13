import type { CoverageResult, TimeSlot } from "@/types/scheduling";

import { HttpClient } from "@/api/core/http-client";
import { Formatters } from "@/lib/formatting/formatters";

export class SchedulingApi {
  static fetchTimeSlots(date: string): Promise<TimeSlot[]> {
    return HttpClient.get<TimeSlot[]>(`/scheduling/time-slots?date=${date}`);
  }

  static fetchCoverageByCep(cep: string): Promise<CoverageResult> {
    const cleanCep = Formatters.onlyDigits(cep);
    return HttpClient.get<CoverageResult>(`/units/validate-coverage?cep=${cleanCep}`);
  }
}
