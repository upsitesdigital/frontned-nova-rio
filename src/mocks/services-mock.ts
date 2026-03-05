import type { Service } from "@/types/service";

const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Faxina Regular",
    description: "Limpeza completa e manutenção periódica",
    icon: "broom",
    basePrice: 50.0,
    allowSingle: true,
    allowPackage: true,
    allowRecurrence: true,
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    uuid: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    name: "Faxina Premium",
    description: "Limpeza completa e manutenção periódica",
    icon: "sketch-logo",
    basePrice: 50.0,
    allowSingle: true,
    allowPackage: true,
    allowRecurrence: true,
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 3,
    uuid: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    name: "Faxina Pós-Obra",
    description: "Limpeza especializada após construção",
    icon: "star-four",
    basePrice: 50.0,
    allowSingle: true,
    allowPackage: false,
    allowRecurrence: false,
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

async function fetchMockServices(): Promise<Service[]> {
  return MOCK_SERVICES;
}

export { fetchMockServices, MOCK_SERVICES };
