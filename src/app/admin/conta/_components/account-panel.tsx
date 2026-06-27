"use client";

import { DsProfileSection, type DsProfileField } from "@/design-system";
import { useAdminProfileInfoStore } from "@/stores/admin/admin-profile-info-store";
import { AdminRoleLabel } from "@/lib/display/admin-role-label";

export function AccountPanel() {
  const profile = useAdminProfileInfoStore((s) => s.profile);

  if (!profile) return null;

  const fields: DsProfileField[] = [
    { label: "Nome", value: profile.name },
    { label: "E-mail", value: profile.email },
    { label: "Função", value: AdminRoleLabel.format(profile.role) },
  ];

  return (
    <DsProfileSection
      changeImageLabel="Alterar imagem"
      title="Resumo da conta"
      cancelLabel="Cancelar"
      initials={profile.name.charAt(0)}
      fields={fields}
      editLabel="Editar"
    />
  );
}
