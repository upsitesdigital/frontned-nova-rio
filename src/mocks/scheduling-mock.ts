import type { CoverageResult, TimeSlot } from "@/types/scheduling";

const MOCK_TIME_SLOTS: TimeSlot[] = [
  { time: "09:30", available: true },
  { time: "10:00", available: true },
  { time: "10:30", available: false },
  { time: "11:00", available: true },
  { time: "11:30", available: true },
  { time: "12:00", available: false },
  { time: "12:30", available: false },
  { time: "13:00", available: true },
  { time: "13:30", available: true },
  { time: "14:00", available: true },
  { time: "14:30", available: false },
  { time: "15:00", available: true },
  { time: "15:30", available: true },
  { time: "16:00", available: true },
  { time: "16:30", available: true },
  { time: "17:00", available: false },
  { time: "17:30", available: true },
  { time: "18:00", available: true },
];

const MOCK_COVERAGE: CoverageResult = {
  covered: true,
  address: {
    cep: "20040-020",
    street: "Rua da Assembleia",
    neighborhood: "Centro",
    city: "Rio de Janeiro",
    state: "RJ",
  },
  unitId: 1,
  unitName: "Unidade Centro",
};

async function fetchMockTimeSlots(): Promise<TimeSlot[]> {
  return MOCK_TIME_SLOTS;
}

async function fetchMockCoverageByCep(cep: string): Promise<CoverageResult> {
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length !== 8) {
    throw new Error("CEP inválido");
  }
  return { ...MOCK_COVERAGE, address: { ...MOCK_COVERAGE.address, cep } };
}

export { fetchMockTimeSlots, fetchMockCoverageByCep, MOCK_TIME_SLOTS, MOCK_COVERAGE };
