"use client";

import { useEffect } from "react";
import { DsSkeleton } from "@/design-system";
import { useProfileInfoStore } from "@/stores/profile-info-store";
import { ProfileInfoPanel } from "./_components/profile-info-panel";
import { EmailChangeDialog } from "./_components/email-change-dialog";
import { PasswordChangeDialog } from "./_components/password-change-dialog";
import { DeleteAccountDialog } from "./_components/delete-account-dialog";

export default function ProfilePage() {
  const { isLoading, error, loadProfile } = useProfileInfoStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (isLoading) {
    return (
      <div>
        <DsSkeleton className="mb-6 h-16 w-40" />
        <DsSkeleton className="h-150 w-full max-w-125.25 rounded-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-base text-nova-error">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-16 text-[48px] font-semibold leading-[1.3] tracking-[-1.92px] text-black">
        Perfil
      </h1>
      <div className="max-w-125.25">
        <ProfileInfoPanel />
      </div>
      <EmailChangeDialog />
      <PasswordChangeDialog />
      <DeleteAccountDialog />
    </div>
  );
}
