import { AdminEmployeesApi, type AdminEmployee } from "@/api/admin/admin-employees-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

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
  { success: true; employee: AdminEmployee } | { success: false; error: string };

class SaveAdminEmployee {
  static async saveAdminEmployee(input: SaveEmployeeInput): Promise<SaveEmployeeResult> {
    try {
      const employee = await AdminEmployeesApi.updateAdminEmployee(input.id, {
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
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminEmployees.saveError),
      };
    }
  }
}

export { SaveAdminEmployee, type SaveEmployeeInput, type SaveEmployeeResult };
