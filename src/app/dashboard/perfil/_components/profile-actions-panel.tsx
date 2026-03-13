"use client";

import { PencilSimpleIcon, EnvelopeSimpleIcon, LockKeyIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { DsProfileCard, type DsProfileCardAction } from "@/design-system";
import { useProfileStore } from "@/stores/profile-store";
import { EmailChangeDialog } from "./email-change-dialog";
import { PasswordChangeDialog } from "./password-change-dialog";
import { DeleteAccountDialog } from "./delete-account-dialog";

function ProfileActionsPanel() {
  const { profile, startEditing, openEmailDialog, openPasswordDialog, openDeleteDialog } =
    useProfileStore();

  if (!profile) return null;

  const actions: DsProfileCardAction[] = [
    {
      icon: PencilSimpleIcon,
      label: "Editar informações",
      onClick: startEditing,
    },
    {
      icon: EnvelopeSimpleIcon,
      label: "Alterar e-mail",
      onClick: openEmailDialog,
    },
    {
      icon: LockKeyIcon,
      label: "Alterar senha",
      onClick: openPasswordDialog,
    },
    {
      icon: TrashIcon,
      label: "Excluir conta",
      onClick: openDeleteDialog,
      variant: "destructive",
    },
  ];

  return (
    <>
      <DsProfileCard
        initials={profile.name.charAt(0)}
        name={profile.name}
        email={profile.email}
        actions={actions}
      />
      <EmailChangeDialog />
      <PasswordChangeDialog />
      <DeleteAccountDialog />
    </>
  );
}

export { ProfileActionsPanel };
