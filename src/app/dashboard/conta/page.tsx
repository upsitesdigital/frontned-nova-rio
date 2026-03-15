"use client";

import { useEffect } from "react";
import { DsSkeleton } from "@/design-system";
import { useProfileInfoStore } from "@/stores/profile-info-store";
import { AccountPanel } from "./_components/account-panel";
import { CardsPanel } from "./_components/cards-panel";

export default function ContaPage() {
  const { isLoading, error, loadProfile } = useProfileInfoStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (isLoading) {
    return (
      <div>
        <DsSkeleton className="mb-6 h-16 w-40" />
        <div className="flex gap-6">
          <DsSkeleton className="h-96 w-full max-w-125.25 rounded-4xl" />
          <DsSkeleton className="h-96 flex-1 rounded-4xl" />
        </div>
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
        Minha conta
      </h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:max-w-125.25">
          <AccountPanel />
        </div>
        <div className="flex-1">
          <CardsPanel />
        </div>
      </div>
    </div>
  );
}
