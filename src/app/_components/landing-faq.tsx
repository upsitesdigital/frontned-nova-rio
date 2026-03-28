"use client";

import { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react/dist/ssr";

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
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[800px] px-6">
        {/* Section header */}
        <div className="mb-12">
          <p className="mb-3 text-base font-semibold text-nova-success">FAQ</p>
          <h2 className="text-[36px] font-medium leading-[1.2] tracking-[-0.5px] text-black">
            Perguntas frequentes
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={item.question}
              className="border-b border-nova-gray-200 last:border-b-0"
            >
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="text-[18px] font-medium text-black">
                  {item.question}
                </span>
                {openIndex === index ? (
                  <CaretUp size={22} className="shrink-0 text-nova-gray-500" />
                ) : (
                  <CaretDown
                    size={22}
                    className="shrink-0 text-nova-gray-500"
                  />
                )}
              </button>

              {openIndex === index && (
                <div className="pb-5">
                  <p className="text-base font-normal leading-[1.6] text-nova-gray-600">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { LandingFAQ };
