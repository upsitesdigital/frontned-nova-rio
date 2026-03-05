import { createPublicAppointment } from "@/api/appointments-api";
import { useConfirmationStore } from "@/stores/confirmation-store";
import { useAddressStore } from "@/stores/address-store";
import { useRegistrationStore } from "@/stores/registration-store";
import { useSchedulingStore } from "@/stores/scheduling-store";
import { useServicesStore } from "@/stores/services-store";
import { format } from "date-fns";

interface SubmitPaymentResult {
  success: boolean;
  error: string | null;
}

async function submitPayment(): Promise<SubmitPaymentResult> {
  const email = useRegistrationStore.getState().email;
  if (!email) {
    return { success: false, error: "E-mail não cadastrado. Volte ao passo de cadastro." };
  }

  const selectedServiceId = useServicesStore.getState().selectedServiceId;
  if (!selectedServiceId) {
    return { success: false, error: "Nenhum serviço selecionado." };
  }

  const { selectedDate, selectedTime, recurrenceType } = useSchedulingStore.getState();
  if (!selectedDate || !selectedTime) {
    return { success: false, error: "Data e horário não selecionados." };
  }

  const { cep, address } = useAddressStore.getState();

  const recurrenceMap: Record<string, string> = {
    avulso: "SINGLE",
    pacote: "PACKAGE",
    recorrencia: "RECURRING",
  };

  try {
    const response = await createPublicAppointment({
      email,
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime: selectedTime,
      duration: 120,
      serviceId: selectedServiceId,
      recurrenceType: recurrenceType ? recurrenceMap[recurrenceType] : undefined,
      locationZip: cep || undefined,
      locationAddress: address
        ? `${address.street}, ${address.neighborhood}, ${address.city} - ${address.state}`
        : undefined,
    });

    useConfirmationStore.getState().setConfirmation({
      serviceName: response.service.name,
      date: response.date,
      startTime: response.startTime,
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to create appointment:", error);
    const message = error instanceof Error ? error.message : "Erro ao criar agendamento.";
    return { success: false, error: message };
  }
}

export { submitPayment, type SubmitPaymentResult };
