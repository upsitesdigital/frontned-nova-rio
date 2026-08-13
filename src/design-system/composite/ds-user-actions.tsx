"use client";

import {
  BellIcon,
  GearIcon,
  CaretDownIcon,
  UserIcon,
  UserCircleCheckIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/core/utils";
import { DsIcon } from "@/design-system/media";
import { Avatar, AvatarFallback, AvatarImage } from "@/design-system/ui/avatar";
import { DsUserMenuItem } from "@/design-system/navigation/ds-user-menu-item";
import { useUserMenuStore } from "@/stores/ui/user-menu-store";

interface DsUserActionsProps {
  notificationsLabel: string;
  settingsLabel: string;
  menuLabel: string;
  profileLabel: string;
  accountLabel: string;
  initials: string;
  avatarSrc?: string;
  notificationCount?: number;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onAccountClick?: () => void;
  profileHref?: string;
  accountHref?: string;
  className?: string;
}

function formatBadge(count: number): string {
  if (count >= 10) return "9+";
  return String(count);
}

function DsUserActions({
  notificationsLabel,
  settingsLabel,
  menuLabel,
  profileLabel,
  accountLabel,
  initials,
  avatarSrc,
  notificationCount = 0,
  onNotificationClick,
  onSettingsClick,
  onProfileClick,
  onAccountClick,
  profileHref,
  accountHref,
  className,
}: DsUserActionsProps) {
  const open = useUserMenuStore((s) => s.open);
  const setOpen = useUserMenuStore((s) => s.setOpen);

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <button
        type="button"
        onClick={onNotificationClick}
        className="relative flex size-12 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent"
        aria-label={notificationsLabel}
      >
        <DsIcon icon={BellIcon} size="lg" />
        {notificationCount > 0 && (
          <span className="absolute right-1.5 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-nova-error px-1 text-[10px] font-bold leading-none text-white">
            {formatBadge(notificationCount)}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={onSettingsClick}
        className="flex size-12 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent"
        aria-label={settingsLabel}
      >
        <DsIcon icon={GearIcon} size="lg" />
      </button>

      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex shrink-0 cursor-pointer items-center gap-1.5"
          aria-label={menuLabel}
          aria-expanded={open}
        >
          <Avatar className="size-12 border border-nova-gray-300">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={initials} />}
            <AvatarFallback className="bg-nova-primary text-[20px] font-medium leading-[1.3] text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <DsIcon icon={CaretDownIcon} size="md" className="text-nova-gray-400" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
            <div className="absolute right-0 top-full z-50 mt-2 flex w-56 flex-col gap-1 rounded-[10px] bg-white p-2 shadow-(--nova-shadow-soft)">
              <DsUserMenuItem
                icon={UserIcon}
                label={profileLabel}
                href={profileHref}
                onClick={() => {
                  setOpen(false);
                  onProfileClick?.();
                }}
                className="bg-nova-gray-50"
              />
              <DsUserMenuItem
                icon={UserCircleCheckIcon}
                label={accountLabel}
                href={accountHref}
                onClick={() => {
                  setOpen(false);
                  onAccountClick?.();
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export { DsUserActions, type DsUserActionsProps };
