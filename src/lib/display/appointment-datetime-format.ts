export class AppointmentDateTimeFormat {
  static parseDateStringToLocalDate(value: string): Date | undefined {
    if (!value) return undefined;

    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    if (!year || !month || !day) return undefined;

    const parsedDate = new Date(year, month - 1, day);
    if (Number.isNaN(parsedDate.getTime())) return undefined;

    return parsedDate;
  }

  static formatDateToApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  static normalizeTimeValue(value: string): string {
    return value.length >= 5 ? value.slice(0, 5) : value;
  }

  static extractTimeFromDateTime(value: string | null | undefined): string | undefined {
    if (!value) return undefined;
    const match = value.match(/[T ](\d{2}:\d{2})/);
    return match ? match[1] : undefined;
  }

  static formatDrawerDateLabel(value: string): string {
    const date = AppointmentDateTimeFormat.parseDateStringToLocalDate(value);
    if (!date) return "-";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const now = new Date();
    const isToday =
      now.getDate() === date.getDate() &&
      now.getMonth() === date.getMonth() &&
      now.getFullYear() === date.getFullYear();

    return isToday ? `Hoje, ${day}/${month}` : `${day}/${month}`;
  }

  static formatHourLabel(value: string): string {
    const normalized = AppointmentDateTimeFormat.normalizeTimeValue(value);
    const [hour] = normalized.split(":");
    return hour ? `${hour} Horas` : "-";
  }

  static formatTimestamp(value: string | null | undefined): string {
    if (!value) return "-";

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return value;

    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(parsedDate);
  }
}
