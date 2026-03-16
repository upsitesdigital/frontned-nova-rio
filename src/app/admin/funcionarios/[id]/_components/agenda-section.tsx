"use client";

import { DsAgendaCard } from "@/design-system";
import { useAdminEmployeeEditStore } from "@/stores/admin-employee-edit-store";

function AgendaSection() {
  const currentMonth = useAdminEmployeeEditStore((s) => s.currentMonth);
  const busyDates = useAdminEmployeeEditStore((s) => s.busyDates);
  const setCurrentMonth = useAdminEmployeeEditStore((s) => s.setCurrentMonth);

  return (
    <DsAgendaCard
      currentMonth={currentMonth}
      onCurrentMonthChange={setCurrentMonth}
      busyDates={busyDates}
      className="rounded-4xl"
    />
  );
}

export { AgendaSection };
