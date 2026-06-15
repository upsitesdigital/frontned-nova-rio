import { format, parseISO, isValid, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

class DateHelpers {
  static formatShortDate(dateString: string): string {
    const parsed = parseISO(dateString);
    return isValid(parsed) ? format(parsed, "dd/MM") : "--/--";
  }

  static getCurrentMonthLabel(): string {
    return format(new Date(), "MMMM", { locale: ptBR });
  }

  static formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  static buildTodayDate(): string {
    return format(new Date(), "yyyy-MM-dd");
  }

  static buildWeekRange(): { weekStart: string; weekEnd: string } {
    const now = new Date();
    return {
      weekStart: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
      weekEnd: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
    };
  }
}

export { DateHelpers };
