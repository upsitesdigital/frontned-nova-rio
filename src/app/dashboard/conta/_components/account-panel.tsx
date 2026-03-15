"use client";

import { EnvelopeSimpleIcon, LockKeyIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { DsProfileCard, type DsProfileCardAction } from "@/design-system";
import { useProfileInfoStore } from "@/stores/profile-info-store";
import { useEmailChangeStore } from "@/stores/email-change-store";
import { usePasswordChangeStore } from "@/stores/password-change-store";
import { useDeleteAccountStore } from "@/stores/delete-account-store";
import { EmailChangeDialog } from "../../perfil/_components/email-change-dialog";
import { PasswordChangeDialog } from "../../perfil/_components/password-change-dialog";
import { DeleteAccountDialog } from "../../perfil/_components/delete-account-dialog";

function AccountPanel() {
  const profile = useProfileInfoStore((s) => s.profile);
  const openEmailDialog = useEmailChangeStore((s) => s.openEmailDialog);
  const openPasswordDialog = usePasswordChangeStore((s) => s.openPasswordDialog);
  const openDeleteDialog = useDeleteAccountStore((s) => s.openDeleteDialog);

  if (!profile) return null;

  const actions: DsProfileCardAction[] = [
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
      label: "Deletar conta",
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

export { AccountPanel };
