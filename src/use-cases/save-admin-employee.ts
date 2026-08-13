import { updateAdminEmployee, type AdminEmployee } from "@/api/admin-employees-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface SaveEmployeeInput {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  address?: string;
  availabilityFrom?: string;
  availabilityTo?: string;
  notes?: string;
  unitId?: number;
  status: "ACTIVE" | "INACTIVE";
}

type SaveEmployeeResult =
  | { success: true; employee: AdminEmployee }
  | { success: false; error: string };

async function saveAdminEmployee(
  input: SaveEmployeeInput,
): Promise<SaveEmployeeResult> {
  try {
    const employee = await updateAdminEmployee(input.id, {
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      phone: input.phone || undefined,
      address: input.address || undefined,
      availabilityFrom: input.availabilityFrom || undefined,
      availabilityTo: input.availabilityTo || undefined,
      notes: input.notes || undefined,
      unitId: input.unitId ?? undefined,
      status: input.status,
    });

    return { success: true, employee };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.adminEmployees.saveError),
    };
  }
}

export { saveAdminEmployee, type SaveEmployeeInput, type SaveEmployeeResult };
