"use client";

import { DsProfileSection, type DsProfileField } from "@/design-system";
import { useProfileStore } from "@/stores/profile-store";

function ProfileInfoPanel() {
  const {
    profile,
    isEditing,
    isSaving,
    editName,
    editPhone,
    editCompany,
    editCpfCnpj,
    editAddress,
    startEditing,
    cancelEditing,
    setEditName,
    setEditPhone,
    setEditCompany,
    setEditCpfCnpj,
    setEditAddress,
    saveProfile,
  } = useProfileStore();

  if (!profile) return null;

  const fields: DsProfileField[] = isEditing
    ? [
        { label: "Nome", value: editName, editable: true, onChange: setEditName },
        { label: "E-mail", value: profile.email },
        { label: "Telefone", value: editPhone, editable: true, onChange: setEditPhone },
        { label: "Empresa", value: editCompany, editable: true, onChange: setEditCompany },
        { label: "CPF/CNPJ", value: editCpfCnpj, editable: true, onChange: setEditCpfCnpj },
        { label: "Endereço", value: editAddress, editable: true, onChange: setEditAddress },
      ]
    : [
        { label: "Nome", value: profile.name },
        { label: "E-mail", value: profile.email },
        { label: "Telefone", value: profile.phone ?? "-" },
        { label: "Empresa", value: profile.company ?? "-" },
        { label: "CPF/CNPJ", value: profile.cpfCnpj ?? "-" },
        { label: "Endereço", value: profile.address ?? "-" },
      ];

  return (
    <DsProfileSection
      initials={profile.name.charAt(0)}
      fields={fields}
      onEdit={isEditing ? saveProfile : startEditing}
      onCancel={isEditing ? cancelEditing : undefined}
      editLabel={isEditing ? (isSaving ? "Salvando..." : "Salvar") : "Editar"}
      editDisabled={isSaving}
      onChangeImage={() => {}}
    />
  );
}

export { ProfileInfoPanel };
