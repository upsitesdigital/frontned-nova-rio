"use client";

import { DsProfileSection, type DsProfileField } from "@/design-system";
import { useAdminProfileInfoStore } from "@/stores/admin/admin-profile-info-store";
import { AdminRoleLabel } from "@/lib/display/admin-role-label";

export function ProfileInfoPanel() {
  const {
    profile,
    isEditing,
    isSaving,
    editName,
    startEditing,
    cancelEditing,
    setEditName,
    saveProfile,
  } = useAdminProfileInfoStore();

  if (!profile) return null;

  const fields: DsProfileField[] = isEditing
    ? [
        { label: "Nome", value: editName, editable: true, onChange: setEditName },
        { label: "E-mail", value: profile.email },
        { label: "Função", value: AdminRoleLabel.format(profile.role) },
      ]
    : [
        { label: "Nome", value: profile.name },
        { label: "E-mail", value: profile.email },
        { label: "Função", value: AdminRoleLabel.format(profile.role) },
      ];

  return (
    <DsProfileSection
      changeImageLabel="Alterar imagem"
      title="Informações pessoais"
      cancelLabel="Cancelar"
      initials={profile.name.charAt(0)}
      fields={fields}
      onEdit={isEditing ? saveProfile : startEditing}
      onCancel={isEditing ? cancelEditing : undefined}
      editLabel={isEditing ? (isSaving ? "Salvando..." : "Salvar") : "Editar"}
      editDisabled={isSaving}
    />
  );
}
