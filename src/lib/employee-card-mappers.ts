import {
  IdentificationCardIcon,
  WhatsappLogoIcon,
  EnvelopeSimpleIcon,
  CheckIcon,
  CalendarBlankIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { EmployeeStatus } from "@/api/admin-employees-api";
import { formatPhone, formatCpfCnpj, stripDdi } from "@/lib/formatters";
import type {
  DsEmployeeInfoCardContact,
  DsEmployeeInfoCardDetail,
  DsEmployeeInfoCardAction,
  DsEmployeeInfoCardStatus,
} from "@/design-system";

function buildEmployeeContacts(
  cpf: string,
  phone: string | null,
  email: string,
): DsEmployeeInfoCardContact[] {
  const contacts: DsEmployeeInfoCardContact[] = [
    { icon: IdentificationCardIcon, value: formatCpfCnpj(cpf) },
  ];

  if (phone) {
    contacts.push({ icon: WhatsappLogoIcon, value: formatPhone(stripDdi(phone)) });
  }

  contacts.push({ icon: EnvelopeSimpleIcon, value: email });

  return contacts;
}

function buildEmployeeStatus(status: EmployeeStatus): DsEmployeeInfoCardStatus {
  if (status === "ACTIVE") {
    return { icon: CheckIcon, label: "Ativo", variant: "active" };
  }
  return { icon: XIcon, label: "Inativo", variant: "inactive" };
}

function formatAvailability(from: string | null, to: string | null): string {
  if (!from || !to) return "Não definida";
  return `${from} às ${to}`;
}

function buildEmployeeDetails(
  availabilityFrom: string | null,
  availabilityTo: string | null,
): DsEmployeeInfoCardDetail[] {
  return [
    { label: "Disponibilidade", value: formatAvailability(availabilityFrom, availabilityTo) },
  ];
}

function buildEmployeeActions(
  onSchedule: () => void,
  onEdit: () => void,
): DsEmployeeInfoCardAction[] {
  return [
    { label: "Agenda", icon: CalendarBlankIcon, onClick: onSchedule },
    { label: "Editar", onClick: onEdit },
  ];
}

export { buildEmployeeContacts, buildEmployeeStatus, buildEmployeeDetails, buildEmployeeActions };
