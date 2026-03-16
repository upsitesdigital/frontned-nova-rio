import { fetchPublicServices } from "@/api/services-api";
import { MESSAGES } from "@/lib/messages";
import type { Service } from "@/types/service";

interface LoadPublicServicesResult {
  data: Service[] | null;
  error: string | null;
}

async function loadPublicServices(): Promise<LoadPublicServicesResult> {
  try {
    const services = await fetchPublicServices();
    return { data: services, error: null };
  } catch {
    return { data: null, error: MESSAGES.services.loadError };
  }
}

export { loadPublicServices, type LoadPublicServicesResult };
