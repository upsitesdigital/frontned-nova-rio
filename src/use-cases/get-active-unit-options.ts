import { fetchUnits } from "@/api/admin-appointments-api";
import { MESSAGES } from "@/lib/messages";

interface UnitOption {
  id: number;
  name: string;
}

interface GetActiveUnitOptionsResult {
  data: UnitOption[] | null;
  error: string | null;
}

async function getActiveUnitOptions(): Promise<GetActiveUnitOptionsResult> {
  try {
    const units = await fetchUnits();
    const activeOptions = units.filter((u) => u.isActive).map((u) => ({ id: u.id, name: u.name }));
    return { data: activeOptions, error: null };
  } catch {
    return { data: null, error: MESSAGES.adminAppointments.unitsError };
  }
}

export { getActiveUnitOptions, type UnitOption };
