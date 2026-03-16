import { startOfMonth, endOfMonth, format } from "date-fns";

import { fetchAdminAppointments } from "@/api/admin-appointments-api";

interface LoadBusyDatesInput {
  employeeId: number;
  currentMonth: Date;
}

async function loadEmployeeBusyDates(input: LoadBusyDatesInput): Promise<Date[]> {
  const monthStart = format(startOfMonth(input.currentMonth), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(input.currentMonth), "yyyy-MM-dd");

  const response = await fetchAdminAppointments({
    page: 1,
    limit: 100,
    employeeId: input.employeeId,
    weekStart: monthStart,
    weekEnd: monthEnd,
    status: "SCHEDULED",
  });

  return response.data.map((item) => new Date(item.date));
}

export { loadEmployeeBusyDates, type LoadBusyDatesInput };
