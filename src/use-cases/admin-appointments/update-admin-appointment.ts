import { AdminAppointmentsApi } from "@/api/admin/admin-appointments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface UpdateAdminAppointmentInput {
  id: number;
  duration?: number;
  employeeId?: number;
  serviceId?: number;
  locationZip?: string;
  notes?: string;
}

interface UpdateAdminAppointmentResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

class UpdateAdminAppointment {
  static async saveAdminAppointment(
    input: UpdateAdminAppointmentInput,
  ): Promise<UpdateAdminAppointmentResult> {
    try {
      await AdminAppointmentsApi.updateAdminAppointment(input.id, {
        duration: input.duration,
        employeeId: input.employeeId,
        serviceId: input.serviceId,
        locationZip: input.locationZip,
        notes: input.notes,
      });

      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminAppointments.updateError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export {
  UpdateAdminAppointment,
  type UpdateAdminAppointmentInput,
  type UpdateAdminAppointmentResult,
};
