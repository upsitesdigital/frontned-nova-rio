import { AdminEmployeesApi, type AdminEmployee } from "@/api/admin/admin-employees-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

export interface CreateEmployeeInput {
  name: string;
  email: string;
  cpf: string;
  phone: string | null;
  address: string | null;
  availabilityFrom: string | null;
  availabilityTo: string | null;
  notes: string | null;
  unitId: number | null;
}

export type CreateEmployeeResult =
  { success: true; employee: AdminEmployee } | { success: false; error: string };

export class CreateAdminEmployee {
  static async createAdminEmployee(input: CreateEmployeeInput): Promise<CreateEmployeeResult> {
    try {
      const employee = await AdminEmployeesApi.createAdminEmployee({
        name: input.name,
        email: input.email,
        cpf: input.cpf,
        phone: input.phone ?? null,
        address: input.address ?? null,
        availabilityFrom: input.availabilityFrom ?? null,
        availabilityTo: input.availabilityTo ?? null,
        notes: input.notes ?? undefined,
        unitId: input.unitId ?? undefined,
      });

      return { success: true, employee };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminEmployees.createError),
      };
    }
  }
}
