const RECURRENCE_LABELS: Record<string, string> = {
  SINGLE: "Avulso",
  PACKAGE: "Pacote",
  WEEKLY: "Semanal",
  BIWEEKLY: "Quinzenal",
  MONTHLY: "Mensal",
};

function resolveRecurrenceLabel(type: string): string {
  return RECURRENCE_LABELS[type] ?? type;
}

export { RECURRENCE_LABELS, resolveRecurrenceLabel };
