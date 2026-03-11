import type { CoverageResult, TimeSlot } from "@/types/scheduling";

import { fetchCoverageByCep, fetchTimeSlots } from "./scheduling-api";

async function getTimeSlots(date: string): Promise<TimeSlot[]> {
  return fetchTimeSlots(date);
}

async function getCoverageByCep(cep: string): Promise<CoverageResult> {
  return fetchCoverageByCep(cep);
}

export { getTimeSlots, getCoverageByCep };
