"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";
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
    <section className="relative h-180 overflow-hidden bg-black pt-20">
      <div className="pointer-events-none absolute inset-0 bg-black" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255, 255, 255, 0.28) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 38%, rgba(0,0,0,0.3) 62%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 38%, rgba(0,0,0,0.3) 62%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-304 px-6 lg:px-0">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            className="flex max-w-148.5 flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-base leading-[1.2] font-semibold tracking-[1.6px] text-nova-primary-dark uppercase">
              Segmentos Atendidos
            </p>
            <h2 className="text-[36px] leading-[1.3] font-medium tracking-[-1.44px] text-white">
              Especialistas em atender empresas que exigem o mais alto padrão
            </h2>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.985 }}>
            <DsButton
              asChild
              size="flow"
              className="h-14.75 w-76.5 rounded-xl bg-linear-to-r from-nova-primary-dark to-nova-primary px-8 text-lg tracking-[-0.72px]"
            >
              <Link href="/agendamento" className="group flex items-center gap-4">
                Agende sua limpeza agora
                <ArrowRight
                  size={20}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </DsButton>
          </motion.div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {SEGMENTS.map((segment, index) => (
            <motion.article
              key={segment.label}
              className="group flex flex-col gap-6"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
            >
              <p className="h-12 text-base leading-normal font-medium text-white transition-colors duration-250 group-hover:text-white/85">
                {segment.label}
              </p>
              <div className="relative h-87.75 overflow-hidden bg-nova-gray-700">
                <Image
                  src={segment.image}
                  alt={segment.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export { LandingSegments };
