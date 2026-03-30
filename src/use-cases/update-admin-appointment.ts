import { updateAdminAppointment } from "@/api/admin-appointments-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

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

async function saveAdminAppointment(
  input: UpdateAdminAppointmentInput,
): Promise<UpdateAdminAppointmentResult> {
  try {
    await updateAdminAppointment(input.id, {
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
      error: resolveErrorMessage(error, MESSAGES.adminAppointments.updateError),
      isAuthError: isAuthError(error),
    };
  }
}

export { saveAdminAppointment, type UpdateAdminAppointmentInput, type UpdateAdminAppointmentResult };
