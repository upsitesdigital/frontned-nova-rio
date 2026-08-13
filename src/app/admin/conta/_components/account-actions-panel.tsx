"use client";

import { EnvelopeSimpleIcon, LockKeyIcon } from "@phosphor-icons/react/dist/ssr";
import { DsProfileCard, type DsProfileCardAction } from "@/design-system";
import { useAdminProfileInfoStore } from "@/stores/admin/admin-profile-info-store";
import { useAdminEmailChangeStore } from "@/stores/admin/admin-email-change-store";
import { useAdminPasswordChangeStore } from "@/stores/admin/admin-password-change-store";
import { EmailChangeDialog } from "../../perfil/_components/email-change-dialog";
import { PasswordChangeDialog } from "../../perfil/_components/password-change-dialog";

export function AccountActionsPanel() {
  const profile = useAdminProfileInfoStore((s) => s.profile);
  const openEmailDialog = useAdminEmailChangeStore((s) => s.openEmailDialog);
  const openPasswordDialog = useAdminPasswordChangeStore((s) => s.openPasswordDialog);

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
    </>
  );
}
