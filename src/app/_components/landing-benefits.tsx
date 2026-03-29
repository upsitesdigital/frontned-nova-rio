"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import {
  CalendarCheck,
  Medal,
  SealPercent,
  ShieldCheck,
  CalendarX,
} from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";
import { DsButton, DsIcon } from "@/design-system";

const BENEFITS_ROWS = [
  [
    {
      icon: CalendarCheck,
      title: "Flexibilidade real",
      description: "Agende quando precisar, sem contratos fixos.",
    },
    {
      icon: Medal,
      title: "Exclusividade",
      description:
        "Atendimento voltado a escritórios, consultórios e empresas de alto padrão.",
    },
  ],
  [
    {
      icon: SealPercent,
      title: "Transparência",
      description:
        "Valor por hora a partir de R$50, com desconto para clientes recorrentes.",
    },
    {
      icon: ShieldCheck,
      title: "Segurança",
      description: "Profissionais selecionados, confiáveis e supervisionados.",
    },
  ],
] as const;

const LAST_BENEFIT = {
  icon: CalendarX,
  title: "Praticidade",
  description: "Cancelamento sem multa até 1h antes do agendamento.",
} as const;

const CERTIFICATIONS = [
  { src: "/images/landing/iso-9001.png", alt: "Selo ISO 9001" },
  { src: "/images/landing/iso-45001.png", alt: "Selo ISO 45001" },
  { src: "/images/landing/iso-14001.png", alt: "Selo ISO 14001" },
] as const;

interface BenefitItem {
  icon: typeof CalendarCheck;
  title: string;
  description: string;
}

function BenefitColumn({ icon, title, description }: BenefitItem) {
  return (
    <motion.article
      className="flex w-full flex-col gap-4 rounded-lg p-2 transition-colors duration-250 hover:bg-nova-gray-100"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <DsIcon icon={icon} size="xl" className="text-nova-primary-dark" />
      <div className="flex flex-col gap-2">
        <h3 className="text-xl leading-[1.3] font-medium text-black">{title}</h3>
        <p className="text-base leading-normal text-nova-gray-600">{description}</p>
      </div>
    </motion.article>
  );
}

function LandingBenefits() {
  return (
    <section className="my-12 bg-white lg:my-16">
      <div className="mx-auto max-w-304 border-b border-nova-gray-300 px-6 py-16 lg:min-h-174.25 lg:px-0 lg:py-0">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex w-full flex-col lg:w-97.25 lg:pt-0">
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
            >
              <p className="text-base font-semibold tracking-[1.6px] text-nova-primary-dark uppercase">
                Benefícios
              </p>
              <h2 className="text-[36px] leading-[1.3] font-medium tracking-[-1.44px] text-black">
                Por que escolher a <span className="text-nova-primary-dark">Nova Rio Pay Per Use</span>{" "}
                para sua empresa
              </h2>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.985 }}>
              <DsButton
                asChild
                size="flow"
                className="mt-8 h-15 w-fit rounded-xl bg-linear-to-r from-nova-primary-dark to-nova-primary px-8 text-lg tracking-[-0.72px]"
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

            <div className="mt-37.5 flex flex-col gap-8 lg:pb-16">
              <p className="text-base leading-normal text-nova-gray-600">Nossos selos e certificações:</p>
              <div className="flex items-center gap-11">
                {CERTIFICATIONS.map((cert) => (
                  <Image
                    key={cert.src}
                    src={cert.src}
                    alt={cert.alt}
                    width={76}
                    height={80}
                    className="h-20 w-19 transition-transform duration-250 hover:scale-105"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-148 lg:pt-10.75 lg:pb-16">
            <div className="flex flex-col gap-6">
              {BENEFITS_ROWS.map((row, index) => (
                <div key={row[0].title}>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-8.5">
                    {row.map((benefit) => (
                      <BenefitColumn
                        key={benefit.title}
                        icon={benefit.icon}
                        title={benefit.title}
                        description={benefit.description}
                      />
                    ))}
                  </div>
                  {index < BENEFITS_ROWS.length - 1 && (
                    <div className="mt-6 h-px w-full bg-nova-gray-300" />
                  )}
                </div>
              ))}

              <div className="h-px w-full bg-nova-gray-300" />

              <div className="max-w-70">
                <BenefitColumn
                  icon={LAST_BENEFIT.icon}
                  title={LAST_BENEFIT.title}
                  description={LAST_BENEFIT.description}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { LandingBenefits };
