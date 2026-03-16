import { fetchServices } from "@/api/admin-dashboard-api";

interface ActiveServiceOption {
  id: number;
  name: string;
}

async function getActiveServiceOptions(): Promise<ActiveServiceOption[]> {
  const rawServices = await fetchServices();
  return rawServices.filter((s) => s.isActive).map((s) => ({ id: s.id, name: s.name }));
}

export { getActiveServiceOptions, type ActiveServiceOption };
