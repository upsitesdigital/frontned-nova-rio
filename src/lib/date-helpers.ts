import { format, parseISO, isValid, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

function formatShortDate(dateString: string): string {
  const parsed = parseISO(dateString);
  return isValid(parsed) ? format(parsed, "dd/MM") : "--/--";
}

function getCurrentMonthLabel(): string {
  return format(new Date(), "MMMM", { locale: ptBR });
}

function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildTodayDate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

function buildWeekRange(): { weekStart: string; weekEnd: string } {
  const now = new Date();
  return {
    weekStart: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
    weekEnd: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
  };
}

export { formatShortDate, getCurrentMonthLabel, formatDateToISO, buildTodayDate, buildWeekRange };
