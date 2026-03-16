"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr";
import { DsAlert, DsButton, DsIcon, DsPageHeader, DsSkeleton } from "@/design-system";
import { useAdminEmployeeEditStore } from "@/stores/admin-employee-edit-store";
import { waitForAuthHydration } from "@/stores/auth-store";
import { PersonalInfoSection } from "./_components/personal-info-section";
import { ServicesSection } from "./_components/services-section";
import { AgendaSection } from "./_components/agenda-section";

export default function AdminEmployeeEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoading, isSaving, error, isAuthError, loadEmployee, saveEmployee, reset } =
    useAdminEmployeeEditStore();

  const employeeId = Number(params.id);

  useEffect(() => {
    waitForAuthHydration().then(() => {
      loadEmployee(employeeId);
    });

    return () => reset();
  }, [employeeId, loadEmployee, reset]);

  useEffect(() => {
    if (isAuthError) {
      router.push("/login");
    }
  }, [isAuthError, router]);

  const handleSave = async () => {
    await saveEmployee();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <DsSkeleton className="h-24 w-full" />
        <div className="flex gap-6">
          <DsSkeleton className="h-125 flex-1" />
          <DsSkeleton className="h-100 w-125" />
          <DsSkeleton className="h-112.5 w-92.5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <DsAlert variant="error" title={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <DsPageHeader
        title="Editar funcionário"
        subtitle="Atualizar informações do funcionário cadastrado."
        onBack={() => router.push("/admin/funcionarios")}
        action={
          <DsButton variant="default" size="flow" disabled={isSaving} onClick={handleSave}>
            <DsIcon icon={FloppyDiskIcon} size="lg" className="text-white" />
            Salvar
          </DsButton>
        }
      />

      <div className="flex items-start gap-4">
        <div className="w-157.75 shrink-0">
          <PersonalInfoSection />
        </div>
        <div className="w-125 shrink-0">
          <ServicesSection />
        </div>
        <div className="w-93 shrink-0">
          <AgendaSection />
        </div>
      </div>
    </div>
  );
}
