"use client";

import {
  BroomIcon,
  DeviceMobileCameraIcon,
  UsersThreeIcon,
  CurrencyDollarIcon,
} from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";
import { DsIcon } from "@/design-system";

const howItWorksSteps = [
  {
    icon: BroomIcon,
    title: "Escolha o serviço",
    description: "Selecione faxina regular ou limpeza recorrente.",
  },
  {
    icon: DeviceMobileCameraIcon,
    title: "Agende online",
    description: "Escolha data e horário com antecedência mínima de 1h.",
  },
  {
    icon: UsersThreeIcon,
    title: "Equipe especializada",
    description: "Profissionais uniformizados e treinados chegam até você.",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Pagamento facilitado",
    description: "Cobrança automática, sem burocracia e sem inadimplência.",
  },
] as const;

export function LandingHowItWorks() {
  return (
    <section className="bg-nova-gray-100 py-30">
      <div className="mx-auto max-w-304 px-6">
        <motion.div
          className="mx-auto mb-16 flex max-w-200 flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-base leading-[1.2] font-semibold tracking-[3.2px] text-nova-primary-dark uppercase">
            Como Funciona
          </p>
          <h2 className="text-[36px] leading-[1.3] font-medium tracking-[-1.44px] text-black">
            Agendamento em minutos, serviço impecável sempre que precisar.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {howItWorksSteps.map((step, index) => (
            <motion.article
              key={step.title}
              className="flex h-63.75 flex-col items-center bg-white px-2 pt-8 text-center transition-shadow duration-300 hover:shadow-(--nova-shadow-soft)"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
            >
              <motion.div
                className="flex size-16 items-center justify-center rounded-full bg-nova-primary-light"
                whileHover={{ rotate: -6, scale: 1.06 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              >
                <DsIcon icon={step.icon} size="xl" className="text-nova-primary-dark" />
              </motion.div>

              <div className="mt-6 flex w-full max-w-69 flex-col items-center gap-2">
                <h3 className="text-2xl leading-[1.3] font-medium tracking-[-0.96px] text-black">
                  {step.title}
                </h3>
                <p className="text-base leading-normal tracking-[-0.64px] text-nova-gray-600">
                  {step.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
