"use client";

import { Bell, Gear, CaretDownIcon, User, UserCircleCheck } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/core/utils";
import { DsIcon } from "@/design-system/media";
import { Avatar, AvatarFallback, AvatarImage } from "@/design-system/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/design-system/ui/dropdown-menu";

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
  className,
}: DsUserActionsProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <button
        type="button"
        onClick={onNotificationClick}
        className="relative flex size-12 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent"
        aria-label={notificationsLabel}
      >
        <DsIcon icon={Bell} size="lg" />
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
        <DsIcon icon={Gear} size="lg" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex shrink-0 cursor-pointer items-center gap-1.5"
            aria-label={menuLabel}
          >
            <Avatar className="size-12 border border-nova-gray-300">
              {avatarSrc && <AvatarImage src={avatarSrc} alt={initials} />}
              <AvatarFallback className="bg-nova-primary text-[20px] font-medium leading-[1.3] text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <DsIcon icon={CaretDownIcon} size="md" className="text-nova-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-56 rounded-[10px] border-none p-2 shadow-[0px_12px_44px_0px_rgba(111,124,142,0.05)]"
        >
          <DropdownMenuItem
            onClick={onProfileClick}
            className="flex h-14 cursor-pointer items-center gap-2 rounded-[10px] bg-nova-gray-50 px-6 py-4 text-base font-medium tracking-[-0.64px] text-nova-gray-700 hover:bg-nova-gray-100 focus:bg-nova-gray-100"
          >
            <DsIcon icon={User} size="lg" className="text-nova-gray-700" />
            {profileLabel}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onAccountClick}
            className="flex h-14 cursor-pointer items-center gap-2 rounded-[10px] px-6 py-4 text-base font-medium tracking-[-0.64px] text-nova-gray-700 hover:bg-nova-gray-50 focus:bg-nova-gray-50"
          >
            <DsIcon icon={UserCircleCheck} size="lg" className="text-nova-gray-700" />
            {accountLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export { DsUserActions, type DsUserActionsProps };
