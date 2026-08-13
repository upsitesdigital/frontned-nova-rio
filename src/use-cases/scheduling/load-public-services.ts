import { ServicesApi } from "@/api/client/services-api";
import { Messages } from "@/lib/core/messages";
import type { Service } from "@/types/service";

interface LoadPublicServicesResult {
  data: Service[] | null;
  error: string | null;
}

class LoadPublicServices {
  static async loadPublicServices(): Promise<LoadPublicServicesResult> {
    try {
      const services = await ServicesApi.fetchPublicServices();
      return { data: services, error: null };
    } catch {
      return { data: null, error: Messages.services.loadError };
    }
  }
}

export { LoadPublicServices, type LoadPublicServicesResult };
