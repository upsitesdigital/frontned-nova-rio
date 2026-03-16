import { fetchEmployees } from "@/api/admin-appointments-api";
import { MESSAGES } from "@/lib/messages";

interface EmployeeOption {
  id: number;
  name: string;
}

interface GetActiveEmployeeOptionsResult {
  data: EmployeeOption[] | null;
  error: string | null;
}

async function getActiveEmployeeOptions(): Promise<GetActiveEmployeeOptionsResult> {
  try {
    const employees = await fetchEmployees();
    const activeOptions = employees
      .filter((e) => e.isActive)
      .map((e) => ({ id: e.id, name: e.name }));
    return { data: activeOptions, error: null };
  } catch {
    return { data: null, error: MESSAGES.adminAppointments.employeesError };
  }
}

export { getActiveEmployeeOptions, type EmployeeOption };
