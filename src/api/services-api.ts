import type { PaginatedResponse, Service } from "@/types/service";

import { httpGet } from "./http-client";

async function fetchServices(): Promise<Service[]> {
  const response = await httpGet<PaginatedResponse<Service>>("/services?limit=50");
  return response.data;
}

export { fetchServices };
