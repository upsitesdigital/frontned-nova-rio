import { appConfig } from "@/config/app";
import { fetchMockCoverageByCep, fetchMockTimeSlots } from "@/mocks/scheduling-mock";
import type { CoverageResult, TimeSlot } from "@/types/scheduling";

import { fetchCoverageByCep, fetchTimeSlots } from "./scheduling-api";

async function getTimeSlots(date: string): Promise<TimeSlot[]> {
  if (appConfig.useMockData) {
    return fetchMockTimeSlots();
  }
  return fetchTimeSlots(date);
}

async function getCoverageByCep(cep: string): Promise<CoverageResult> {
  if (appConfig.useMockData) {
    return fetchMockCoverageByCep(cep);
  }
  return fetchCoverageByCep(cep);
}

export { getTimeSlots, getCoverageByCep };
