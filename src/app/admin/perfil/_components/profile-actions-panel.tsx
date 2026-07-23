"use client";

import { PencilSimpleIcon, EnvelopeSimpleIcon, LockKeyIcon } from "@phosphor-icons/react/dist/ssr";
import { DsProfileCard, type DsProfileCardAction } from "@/design-system";
import { useAdminProfileInfoStore } from "@/stores/admin/admin-profile-info-store";
import { useAdminEmailChangeStore } from "@/stores/admin/admin-email-change-store";
import { useAdminPasswordChangeStore } from "@/stores/admin/admin-password-change-store";

export function ProfileActionsPanel() {
  const profile = useAdminProfileInfoStore((s) => s.profile);
  const startEditing = useAdminProfileInfoStore((s) => s.startEditing);
  const openEmailDialog = useAdminEmailChangeStore((s) => s.openEmailDialog);
  const openPasswordDialog = useAdminPasswordChangeStore((s) => s.openPasswordDialog);

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
  ];

  return (
    <DsProfileCard
      initials={profile.name.charAt(0)}
      name={profile.name}
      email={profile.email}
      actions={actions}
    />
  );
}
