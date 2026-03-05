import { CreditCard, DeviceMobileCamera, QrCode } from "@phosphor-icons/react/dist/ssr";

import type { DsIconComponent } from "@/design-system";
import type { PaymentMethod } from "@/types/scheduling";

interface PaymentMethodConfig {
  method: PaymentMethod;
  icon: DsIconComponent;
  label: string;
  description: string;
}

const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    method: "credit",
    icon: CreditCard,
    label: "Cartão de crédito",
    description: "Visa, Mastercard, Elo",
  },
  { method: "pix", icon: QrCode, label: "Pix", description: "Pagamento instantâneo" },
  {
    method: "debit",
    icon: DeviceMobileCamera,
    label: "Cartão de débito",
    description: "Débito em conta",
  },
];

const SERVICE_FEE = 3;

export { PAYMENT_METHODS, SERVICE_FEE, type PaymentMethodConfig };
