"use client";

import { useEffect } from "react";
import { DsSkeleton } from "@/design-system";
import { useAdminProfileInfoStore } from "@/stores/admin/admin-profile-info-store";
import { ProfileInfoPanel } from "./_components/profile-info-panel";
import { ProfileActionsPanel } from "./_components/profile-actions-panel";
import { EmailChangeDialog } from "./_components/email-change-dialog";
import { PasswordChangeDialog } from "./_components/password-change-dialog";

export default function AdminProfilePage() {
  const { isLoading, error, loadProfile } = useAdminProfileInfoStore();

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
      <h1 className="mb-16 text-3xl font-semibold leading-[1.3] tracking-[-1.92px] sm:text-[48px] text-black">
        Perfil
      </h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:max-w-125.25">
          <ProfileInfoPanel />
        </div>
        <div className="flex-1">
          <ProfileActionsPanel />
        </div>
      </div>
      <EmailChangeDialog />
      <PasswordChangeDialog />
    </div>
  );
}
