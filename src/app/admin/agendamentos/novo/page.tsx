"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr";
import { DsButton, DsIcon, DsLoadingState, DsPageHeader, DsAlert } from "@/design-system";
import { useAdminCreateAppointmentStore } from "@/stores/admin-create-appointment-store";
import { waitForAuthHydration } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";
import { MESSAGES } from "@/lib/messages";
import { ServiceInfoCard } from "./_components/service-info-card";
import { AppointmentDetailsCard } from "./_components/appointment-details-card";
import { DateTimeCard } from "./_components/date-time-card";

export default function AdminCreateAppointmentPage() {
  const router = useRouter();
  const {
    isOptionsLoading,
    isSubmitting,
    error,
    employeeConflict,
    loadOptions,
    submitAppointment,
    reset,
  } = useAdminCreateAppointmentStore();

  useEffect(() => {
    reset();
    waitForAuthHydration().then(() => {
      loadOptions();
    });
  }, [loadOptions, reset]);

  const handleSave = async () => {
    const success = await submitAppointment();
    if (success) {
      useToastStore.getState().showToast(MESSAGES.adminAppointments.createSuccess, "success");
      router.push("/admin/agendamentos");
    }
  };

  if (isOptionsLoading) {
    return <DsLoadingState message="Carregando formulário..." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <DsPageHeader
          title="Criar Novo Agendamento"
          subtitle="Preencha os detalhes para criar um novo agendamento"
          onBack={() => router.push("/admin/agendamentos")}
        />
        <DsButton
          variant="default"
          size="flow"
          disabled={isSubmitting}
          onClick={handleSave}
          className="h-auto gap-1.5 bg-nova-primary py-4 leading-normal text-white hover:bg-nova-primary/90"
        >
          <DsIcon icon={FloppyDiskIcon} size="lg" className="size-6 text-white" />
          {isSubmitting ? "Salvando..." : "Salvar"}
        </DsButton>
      </div>

      {error && <DsAlert title={error} variant="error" />}
      {employeeConflict && (
        <DsAlert
          title="Conflito de horário"
          description="Verifique o funcionário selecionado para o serviço e tente novamente"
          variant="error"
        />
      )}

      <div className="flex items-start gap-4">
        <ServiceInfoCard />
        <AppointmentDetailsCard />
        <DateTimeCard />
      </div>
    </div>
  );
}
