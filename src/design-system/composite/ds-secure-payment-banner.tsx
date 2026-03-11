import { LockIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";
import { DsImage } from "@/design-system/media";

interface DsSecurePaymentBannerProps {
  title?: string;
  description?: string;
  className?: string;
}

function DsSecurePaymentBanner({
  title = "Pagamento Seguro",
  description = "Seus dados são protegidos com criptografia SSL",
  className,
}: DsSecurePaymentBannerProps) {
  return (
    <div
      className={cn(
        "relative flex items-start gap-6 overflow-clip rounded-2xl bg-black px-10 py-11.5",
        className,
      )}
    >
      <DsImage
        src="/images/secure-payment.png"
        alt=""
        width={696}
        height={418}
        className="pointer-events-none absolute inset-0 size-full object-cover"
        aria-hidden
      />
      <div className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-primary">
        <DsIcon icon={LockIcon} size="md" className="text-white" />
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col gap-2 leading-[1.3]">
        <p className="text-[20px] font-medium tracking-[-0.8px] text-white">{title}</p>
        <p className="text-base tracking-[-0.64px] text-nova-gray-100">{description}</p>
      </div>
    </div>
  );
}

export { DsSecurePaymentBanner, type DsSecurePaymentBannerProps };
