import { startOfMonth, endOfMonth, format } from "date-fns";

import { AdminAppointmentsApi } from "@/api/admin/admin-appointments-api";
import { DateHelpers } from "@/lib/formatting/date-helpers";

interface LoadBusyDatesInput {
  employeeId: number;
  currentMonth: Date;
}

class LoadEmployeeBusyDates {
  static async loadEmployeeBusyDates(input: LoadBusyDatesInput): Promise<Date[]> {
    const monthStart = format(startOfMonth(input.currentMonth), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(input.currentMonth), "yyyy-MM-dd");

    const response = await AdminAppointmentsApi.fetchAdminAppointments({
      page: 1,
      limit: 100,
      employeeId: input.employeeId,
      weekStart: monthStart,
      weekEnd: monthEnd,
      status: "SCHEDULED",
    });

    return response.data
      .map((item) => DateHelpers.parseDate(item.date))
      .filter((date): date is Date => date !== null);
  }
}

export { LoadEmployeeBusyDates, type LoadBusyDatesInput };
