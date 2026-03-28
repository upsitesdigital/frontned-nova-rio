import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { DsButton } from "@/design-system";

const SEGMENTS = [
  {
    label: "Escritórios de advocacia, contabilidade e consultoria.",
    image: "/images/landing/boardroom.jpg",
    alt: "Sala de reunião corporativa",
  },
  {
    label: "Consultórios médicos e odontológicos.",
    image: "/images/landing/hospital.jpg",
    alt: "Ambiente hospitalar",
  },
  {
    label: "Clínicas de cirurgia plástica e estética.",
    image: "/images/landing/estetica.jpg",
    alt: "Clínica de estética",
  },
  {
    label: "Empresas e startups em condomínios corporativos premium.",
    image: "/images/landing/office.jpg",
    alt: "Escritório moderno",
  },
];

function LandingSegments() {
  return (
    <section className="relative overflow-hidden bg-black py-20">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/landing/bg-4.jpg"
          alt=""
          fill
          className="object-cover"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto max-w-304 px-6 lg:px-0">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-148.5 flex-col gap-6">
            <p className="text-base leading-[1.2] font-semibold tracking-[1.6px] text-nova-primary-dark uppercase">
              Segmentos Atendidos
            </p>
            <h2 className="text-[36px] leading-[1.3] font-medium tracking-[-1.44px] text-white">
              Especialistas em atender empresas que exigem o mais alto padrão
            </h2>
          </div>

          <DsButton
            asChild
            size="flow"
            className="h-14.75 w-76.5 rounded-xl bg-linear-to-r from-nova-primary-dark to-nova-primary px-8 text-lg tracking-[-0.72px]"
          >
            <Link href="/agendamento" className="flex items-center gap-4">
              Agende sua limpeza agora
              <ArrowRight size={20} weight="bold" />
            </Link>
          </DsButton>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {SEGMENTS.map((segment) => (
            <article key={segment.label} className="flex flex-col gap-6">
              <p className="h-12 text-base leading-normal font-medium text-white">
                {segment.label}
              </p>
              <div className="relative h-87.75 overflow-hidden bg-nova-gray-700">
                <Image
                  src={segment.image}
                  alt={segment.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export { LandingSegments };
