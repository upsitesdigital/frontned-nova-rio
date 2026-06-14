import {
  IdentificationCardIcon,
  WhatsappLogoIcon,
  EnvelopeSimpleIcon,
  CheckIcon,
  CalendarBlankIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { EmployeeStatus } from "@/api/admin/admin-employees-api";
import { Formatters } from "@/lib/formatting/formatters";
import type {
  DsEmployeeInfoCardContact,
  DsEmployeeInfoCardDetail,
  DsEmployeeInfoCardAction,
  DsEmployeeInfoCardStatus,
} from "@/design-system";

class EmployeeCardMappers {
  static buildEmployeeContacts(
    cpf: string,
    phone: string | null,
    email: string,
  ): DsEmployeeInfoCardContact[] {
    const contacts: DsEmployeeInfoCardContact[] = [
      { icon: IdentificationCardIcon, value: Formatters.formatCpfCnpj(cpf) },
    ];

    if (phone) {
      contacts.push({
        icon: WhatsappLogoIcon,
        value: Formatters.formatPhone(Formatters.stripDdi(phone)),
      });
    }

    contacts.push({ icon: EnvelopeSimpleIcon, value: email });

    return contacts;
  }

  static buildEmployeeStatus(status: EmployeeStatus): DsEmployeeInfoCardStatus {
    if (status === "ACTIVE") {
      return { icon: CheckIcon, label: "Ativo", variant: "active" };
    }
    return { icon: XIcon, label: "Inativo", variant: "inactive" };
  }

  private static formatAvailability(from: string | null, to: string | null): string {
    if (!from || !to) return "Não definida";
    return `${from} às ${to}`;
  }

  static buildEmployeeDetails(
    availabilityFrom: string | null,
    availabilityTo: string | null,
  ): DsEmployeeInfoCardDetail[] {
    return [
      {
        label: "Disponibilidade",
        value: EmployeeCardMappers.formatAvailability(availabilityFrom, availabilityTo),
      },
    ];
  }

  static buildEmployeeActions(
    onSchedule: () => void,
    onEdit: () => void,
  ): DsEmployeeInfoCardAction[] {
    return [
      { label: "Agenda", icon: CalendarBlankIcon, onClick: onSchedule },
      { label: "Editar", onClick: onEdit },
    ];
  }
}

export { EmployeeCardMappers };
