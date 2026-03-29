"use client";

import { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";

const FAQ_ITEMS = [
  {
    question: "Qual o valor da hora de limpeza?",
    answer:
      "O valor da hora de limpeza é a partir de R$50,00, com desconto progressivo para contratações recorrentes. Quanto mais você agenda, mais economia você tem.",
  },
  {
    question: "Posso agendar para o mesmo dia?",
    answer:
      "Sim, é possível agendar para o mesmo dia com antecedência mínima de 1 hora. Nossa plataforma mostra em tempo real a disponibilidade dos profissionais.",
  },
  {
    question: "Quais horários vocês atendem?",
    answer:
      "Nossa equipe atende de segunda a sábado, das 8h às 18h. Consulte a disponibilidade diretamente na plataforma ao realizar o agendamento.",
  },
  {
    question: "Posso cancelar um serviço já agendado?",
    answer:
      "Sim, você pode cancelar o serviço sem nenhuma multa até 1 hora antes do horário agendado. Cancelamentos após esse prazo podem ser cobrados.",
  },
  {
    question: "Preciso estar presente durante a limpeza?",
    answer:
      "Não é necessário estar presente. Todos os nossos profissionais passam por uma rigorosa seleção e são supervisionados. Você pode confiar na nossa equipe.",
  },
];

function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <section
      className="bg-nova-gray-100 pb-24 pt-6 text-black"
    >
      <div className="mx-auto max-w-304 px-6">
        <div className="mx-auto max-w-200">
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45 }}
          >
            <p className="mb-3 text-base leading-[1.2] font-semibold tracking-[1.6px] text-nova-primary uppercase">
              FAQ
            </p>
            <h2 className="text-[48px] leading-[1.1] font-medium tracking-[-1.44px] text-black">
              Perguntas frequentes
            </h2>
          </motion.div>

          <div className="flex flex-col border-t border-nova-gray-300">
            {FAQ_ITEMS.map((item, index) => (
              <motion.div
                key={item.question}
                className="border-b border-nova-gray-300"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <button
                  onClick={() => toggle(index)}
                  className="group flex w-full items-center justify-between gap-4 py-5 text-left text-[18px] leading-normal font-medium tracking-[-0.36px] text-black"
                  aria-expanded={openIndex === index}
                >
                  <span className="block flex-1 transition-colors duration-200 group-hover:text-nova-gray-700">
                    {item.question}
                  </span>
                  {openIndex === index ? (
                    <CaretUp size={22} className="shrink-0 text-nova-primary" />
                  ) : (
                    <CaretDown
                      size={22}
                      className="shrink-0 text-nova-primary"
                    />
                  )}
                </button>

                {openIndex === index && (
                  <div className="pb-5">
                    <p className="max-w-180 text-base font-normal leading-[1.6] text-nova-gray-700">
                      {item.answer}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { LandingFAQ };
