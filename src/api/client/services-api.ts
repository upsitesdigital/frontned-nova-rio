import type { PaginatedResponse, Service } from "@/types/service";

import { HttpClient } from "@/api/core/http-client";

class ServicesApi {
  static async fetchPublicServices(): Promise<Service[]> {
    const response = await HttpClient.get<PaginatedResponse<Service>>("/services/public?limit=50");
    return response.data.map((s) => ({ ...s, basePrice: Number(s.basePrice) }));
  }
}

export { ServicesApi };
