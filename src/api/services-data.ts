import type { Service } from "@/types/service";

import { fetchServices } from "./services-api";

async function getServices(): Promise<Service[]> {
  return fetchServices();
}

export { getServices };
