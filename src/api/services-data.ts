import { appConfig } from "@/config/app";
import { fetchMockServices } from "@/mocks/services-mock";
import type { Service } from "@/types/service";

import { fetchServices } from "./services-api";

async function getServices(): Promise<Service[]> {
  if (appConfig.useMockData) {
    return fetchMockServices();
  }
  return fetchServices();
}

export { getServices };
