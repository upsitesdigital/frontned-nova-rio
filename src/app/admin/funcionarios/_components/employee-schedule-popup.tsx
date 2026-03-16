"use client";

import { DsEmployeeScheduleCard } from "@/design-system";
import { useAdminEmployeeScheduleStore } from "@/stores/admin-employee-schedule-store";

function EmployeeSchedulePopup() {
  const open = useAdminEmployeeScheduleStore((s) => s.open);
  const employeeName = useAdminEmployeeScheduleStore((s) => s.employeeName);
  const currentMonth = useAdminEmployeeScheduleStore((s) => s.currentMonth);
  const busyDates = useAdminEmployeeScheduleStore((s) => s.busyDates);
  const setCurrentMonth = useAdminEmployeeScheduleStore((s) => s.setCurrentMonth);
  const closeSchedule = useAdminEmployeeScheduleStore((s) => s.closeSchedule);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-nova-gray-900/20"
        onClick={closeSchedule}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeSchedule();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Fechar"
      />
      <DsEmployeeScheduleCard
        name={employeeName}
        currentMonth={currentMonth}
        onCurrentMonthChange={setCurrentMonth}
        busyDates={busyDates}
        onClose={closeSchedule}
        className="relative z-10 w-87.5 shadow-lg"
      />
    </div>
  );
}

export { EmployeeSchedulePopup };
