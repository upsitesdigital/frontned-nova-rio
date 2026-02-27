"use client";

import { useState } from "react";
import {
  BroomIcon,
  CreditCardIcon,
  MapPinIcon,
  CaretUpIcon,
  CaretDownIcon,
  FloppyDiskIcon,
} from "@phosphor-icons/react";
import {
  DsServiceDetailPopup,
  DsRadioOptionCard,
  DsSchedulePopup,
  DsProfileSection,
} from "@/design-system/composite";
import { DsIcon } from "@/design-system/media";

export default function Home() {
  const [selectedOption, setSelectedOption] = useState("avulso");
  const [addressExpanded, setAddressExpanded] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  return (
    <div className="flex min-h-screen flex-col items-center gap-12 bg-nova-gray-100 p-8">
      {/* Service Detail Popup Preview */}
      <div className="w-full max-w-[640px] overflow-hidden rounded-[20px] bg-white shadow-2xl">
        <DsServiceDetailPopup
          icon={BroomIcon}
          serviceName="Faxina Regular"
          date="16/10"
          onClose={() => {}}
          onReceipt={() => {}}
        >
          {/* Recurrence Section */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-[20px] font-medium leading-[1.3] text-black">
                Configurar Recorrência
              </p>
              <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                Escolha como deseja agendar seus serviços de limpeza
              </p>
            </div>
            <div className="flex gap-3">
              <DsRadioOptionCard
                label="Avulso"
                selected={selectedOption === "avulso"}
                onClick={() => setSelectedOption("avulso")}
              />
              <DsRadioOptionCard
                label="Pacote"
                selected={selectedOption === "pacote"}
                onClick={() => setSelectedOption("pacote")}
              />
              <DsRadioOptionCard
                label="Recorrência"
                selected={selectedOption === "recorrencia"}
                onClick={() => setSelectedOption("recorrencia")}
                badge="5% OFF"
              />
            </div>
          </div>

          {/* Payment & Address Section */}
          <div className="flex flex-col gap-4">
            {/* Payment Info Row */}
            <div className="flex items-center justify-between overflow-hidden rounded-[10px] border border-nova-gray-100 p-4">
              <div className="flex items-start gap-2">
                <DsIcon
                  icon={CreditCardIcon}
                  size="lg"
                  className="text-nova-gray-700"
                />
                <p className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                  Terminado em 0123
                </p>
              </div>
              <div className="flex flex-col items-end text-center leading-[1.3]">
                <p className="text-base font-medium text-nova-gray-700">
                  R$ 57,00
                </p>
                <p className="text-xs tracking-[-0.48px] text-nova-primary">
                  Aprovado
                </p>
              </div>
            </div>

            {/* Address Section */}
            <div className="flex flex-col gap-4 overflow-hidden rounded-[10px] border border-nova-gray-100 p-4">
              <button
                type="button"
                onClick={() => setAddressExpanded(!addressExpanded)}
                className="flex w-full cursor-pointer items-center justify-between"
              >
                <div className="flex flex-1 items-center gap-2">
                  <DsIcon
                    icon={MapPinIcon}
                    size="lg"
                    className="text-nova-gray-700"
                  />
                  <p className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                    Condominio Le Monde
                  </p>
                </div>
                <DsIcon
                  icon={addressExpanded ? CaretUpIcon : CaretDownIcon}
                  size="md"
                  className="text-nova-gray-700"
                />
              </button>

              {addressExpanded && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-base font-medium leading-[1.3] text-nova-gray-700">
                      CEP
                    </p>
                    <div className="flex items-center rounded-[6px] border border-nova-gray-400 px-4 py-3">
                      <p className="text-base leading-[1.5] tracking-[-0.64px] text-nova-gray-700">
                        22640-102
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-base font-medium leading-[1.3] text-nova-gray-700">
                      Endereço
                    </p>
                    <div className="flex items-center rounded-[6px] border border-nova-gray-400 px-4 py-3">
                      <p className="text-base leading-[1.5] tracking-[-0.64px] text-nova-gray-700">
                        Av. das Américas, 3500
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-base font-medium leading-[1.3] text-nova-gray-700">
                      Complemento
                    </p>
                    <div className="flex items-center rounded-[6px] border border-nova-gray-400 px-4 py-3">
                      <p className="text-base leading-[1.5] tracking-[-0.64px] text-nova-gray-700">
                        Sala 305
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setScheduleOpen(true)}
                className="flex h-14 cursor-pointer items-center justify-center rounded-[10px] bg-nova-gray-100 px-8 py-4 transition-colors hover:bg-nova-gray-200"
              >
                <span className="text-[18px] font-medium leading-[1.5] tracking-[-0.72px] text-nova-gray-700">
                  Reagendar
                </span>
              </button>
              <button
                type="button"
                className="flex h-14 cursor-pointer items-center justify-center rounded-[10px] border border-nova-gray-300 px-8 py-4 transition-colors hover:bg-nova-gray-50"
              >
                <span className="text-[18px] font-medium leading-[1.5] tracking-[-0.72px] text-nova-gray-700">
                  Cancelar
                </span>
              </button>
            </div>
            <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-400">
              Cancelamento com 1h de antecedência
            </p>
          </div>

          {/* Save Button */}
          <button
            type="button"
            className="flex h-[60px] cursor-pointer items-center justify-center gap-1 self-start rounded-[12px] bg-primary px-8 py-4 transition-colors hover:bg-nova-primary-dark"
          >
            <DsIcon
              icon={FloppyDiskIcon}
              size="lg"
              className="text-white"
            />
            <span className="text-[18px] font-medium leading-[1.5] tracking-[-0.72px] text-white">
              Salvar alterações
            </span>
          </button>
        </DsServiceDetailPopup>
      </div>

      {/* Profile Section Preview */}
      <DsProfileSection
        initials="C"
        onEdit={() => {}}
        onChangeImage={() => {}}
        fields={[
          { label: "Nome", value: "Caio" },
          { label: "E-mail", value: "email@example.com" },
          { label: "Telefone", value: "-" },
          { label: "Empresa", value: "-" },
          { label: "Endereço", value: "Av. das Américas, 3500" },
        ]}
        className="w-full max-w-[640px]"
      />

      {/* Schedule Popup */}
      <DsSchedulePopup
        open={scheduleOpen}
        date={selectedDate}
        time={selectedTime}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
        onClose={() => setScheduleOpen(false)}
        onConfirm={() => setScheduleOpen(false)}
      />
    </div>
  );
}
