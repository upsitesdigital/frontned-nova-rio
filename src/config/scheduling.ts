import type { RecurrenceType } from "@/types/scheduling";
import type { Service } from "@/types/service";

interface RecurrenceOption {
  type: RecurrenceType;
  label: string;
  badge?: string;
  field: keyof Pick<Service, "allowSingle" | "allowPackage" | "allowRecurrence">;
}

interface FrequencyOption {
  value: string;
  label: string;
}

interface SchedulingStep {
  label: string;
}

const RECURRENCE_OPTIONS: RecurrenceOption[] = [
  { type: "avulso", label: "Avulso", field: "allowSingle" },
  { type: "pacote", label: "Pacote", field: "allowPackage" },
  { type: "recorrencia", label: "Recorrência", badge: "5% OFF", field: "allowRecurrence" },
];

const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { value: "semanal", label: "Semanal" },
  { value: "quinzenal", label: "Quinzenal" },
  { value: "mensal", label: "Mensal" },
];

const SCHEDULING_STEPS: SchedulingStep[] = [
  { label: "Agendar serviço" },
  { label: "Dia e horário" },
  { label: "Cadastro" },
  { label: "Pagamento" },
];

const STEP_PATH_MAP: Record<string, number> = {
  servico: 0,
  "dia-horario": 1,
  cadastro: 2,
  pagamento: 3,
};

export {
  RECURRENCE_OPTIONS,
  FREQUENCY_OPTIONS,
  SCHEDULING_STEPS,
  STEP_PATH_MAP,
  type RecurrenceOption,
  type FrequencyOption,
  type SchedulingStep,
};
