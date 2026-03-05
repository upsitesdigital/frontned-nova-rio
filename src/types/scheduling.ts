type RecurrenceType = "avulso" | "pacote" | "recorrencia";

type RecurrenceFrequency = "semanal" | "quinzenal" | "mensal";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Address {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface CoverageResult {
  covered: boolean;
  address: Address;
  unitId: number | null;
  unitName: string | null;
}

type PaymentMethod = "credit" | "pix" | "debit";

export type {
  RecurrenceType,
  RecurrenceFrequency,
  TimeSlot,
  Address,
  CoverageResult,
  PaymentMethod,
};
