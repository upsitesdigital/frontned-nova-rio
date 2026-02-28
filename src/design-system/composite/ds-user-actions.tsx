import { Bell, Gear, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";
import { Avatar, AvatarFallback, AvatarImage } from "@/design-system/ui/avatar";

interface DsUserActionsProps {
  initials: string;
  avatarSrc?: string;
  hasNotification?: boolean;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onUserMenuClick?: () => void;
  className?: string;
}

function DsUserActions({
  initials,
  avatarSrc,
  hasNotification = false,
  onNotificationClick,
  onSettingsClick,
  onUserMenuClick,
  className,
}: DsUserActionsProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <button
        type="button"
        onClick={onNotificationClick}
        className="relative flex size-12 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent"
        aria-label="Notificações"
      >
        <DsIcon icon={Bell} size="lg" />
        {hasNotification && (
          <span className="absolute right-3 top-2 size-2.5 rounded-full bg-nova-error" />
        )}
      </button>

      <button
        type="button"
        onClick={onSettingsClick}
        className="flex size-12 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent"
        aria-label="Configurações"
      >
        <DsIcon icon={Gear} size="lg" />
      </button>

      <button
        type="button"
        onClick={onUserMenuClick}
        className="flex shrink-0 items-center gap-1.5"
        aria-label="Menu do usuário"
      >
        <Avatar className="size-12 border border-nova-gray-300">
          {avatarSrc && <AvatarImage src={avatarSrc} alt={initials} />}
          <AvatarFallback className="bg-nova-primary text-[20px] font-medium leading-[1.3] text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <DsIcon icon={CaretDown} size="md" className="text-nova-gray-400" />
      </button>
    </div>
  );
}

export { DsUserActions, type DsUserActionsProps };
