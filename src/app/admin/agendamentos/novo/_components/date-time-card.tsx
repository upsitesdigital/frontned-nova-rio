"use client";

import { DsAppointmentCalendar } from "@/design-system";
import { useAdminCreateAppointmentStore } from "@/stores/admin/admin-create-appointment-store";

const disabledDays = [{ dayOfWeek: [0, 6] }];
const disabledDayTooltip = "Não atendemos aos Sáb, Dom e Feriados";

export function DateTimeCard() {
  const { selectedDate, selectedTime, setSelectedDate, setSelectedTime } =
    useAdminCreateAppointmentStore();

  return (
    <div className="flex flex-col gap-6 rounded-[10px] border border-nova-gray-100 bg-white p-6">
      <p className="text-xl font-medium leading-[1.3] text-black">Data e horário</p>
      <DsAppointmentCalendar
        cancelLabel="Cancelar"
        confirmLabel="Ok"
        date={selectedDate}
        time={selectedTime}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
        onCancel={() => {
          setSelectedDate(undefined);
          setSelectedTime("");
        }}
        disabledDays={disabledDays}
        disabledDayTooltip={disabledDayTooltip}
      />
    </div>
  );
}
