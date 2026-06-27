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

class SchedulingConfig {
  static readonly recurrenceOptions: RecurrenceOption[] = [
    { type: "avulso", label: "Avulso", field: "allowSingle" },
    { type: "pacote", label: "Pacote", field: "allowPackage" },
    { type: "recorrencia", label: "Recorrência", badge: "5% OFF", field: "allowRecurrence" },
  ];

  static readonly frequencyOptions: FrequencyOption[] = [
    { value: "semanal", label: "Semanal" },
    { value: "quinzenal", label: "Quinzenal" },
    { value: "mensal", label: "Mensal" },
  ];

  static readonly weeklyTimesOptions: FrequencyOption[] = [
    { value: "1", label: "1x por semana" },
    { value: "2", label: "2x por semana" },
    { value: "3", label: "3x por semana" },
    { value: "4", label: "4x por semana" },
    { value: "5", label: "5x por semana" },
    { value: "6", label: "6x por semana" },
    { value: "7", label: "7x por semana" },
  ];

  static readonly schedulingSteps: SchedulingStep[] = [
    { label: "Agendar serviço" },
    { label: "Dia e horário" },
    { label: "Cadastro" },
    { label: "Pagamento" },
  ];

  static readonly stepPathMap: Record<string, number> = {
    servico: 0,
    "dia-horario": 1,
    cadastro: 2,
    pagamento: 3,
  };
}

export { SchedulingConfig, type RecurrenceOption, type FrequencyOption, type SchedulingStep };
