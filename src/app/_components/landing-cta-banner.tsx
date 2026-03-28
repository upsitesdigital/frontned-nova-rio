import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { DsButton } from "@/design-system";

function LandingCTABanner() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/landing/cta-banner.jpg"
          alt="Nova Rio Pay Per Use"
          fill
          className="object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#14181f]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-[1216px] items-center justify-between px-6 py-24">
        <div className="max-w-[491px]">
          <h2 className="mb-4 text-[52px] font-medium leading-[1.1] tracking-[-1px] text-white">
            Fale com a Nova Rio Pay Per Use
          </h2>
          <p className="mb-8 text-base font-normal leading-[1.6] text-white/80">
            Quer conhecer mais sobre nossos serviços? Entre em contato.
          </p>
          <DsButton asChild size="flow">
            <Link href="/agendamento" className="flex items-center gap-2">
              Agende sua limpeza agora
              <ArrowRight size={20} weight="bold" />
            </Link>
          </DsButton>
        </div>
      </div>
    </section>
  );
}

export { LandingCTABanner };
