import { format, parseISO, isValid } from "date-fns";

function formatShortDate(dateString: string): string {
  const parsed = parseISO(dateString);
  return isValid(parsed) ? format(parsed, "dd/MM") : "--/--";
}

export { formatShortDate };
