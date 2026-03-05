import type { CoverageResult, TimeSlot } from "@/types/scheduling";

import { httpGet } from "./http-client";

async function fetchTimeSlots(date: string): Promise<TimeSlot[]> {
  return httpGet<TimeSlot[]>(`/scheduling/time-slots?date=${date}`);
}

async function fetchCoverageByCep(cep: string): Promise<CoverageResult> {
  const cleanCep = cep.replace(/\D/g, "");
  return httpGet<CoverageResult>(`/units/validate-coverage?cep=${cleanCep}`);
}

export { fetchTimeSlots, fetchCoverageByCep };
