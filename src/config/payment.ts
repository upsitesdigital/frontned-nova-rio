import { CreditCard, DeviceMobileCameraIcon, QrCode } from "@phosphor-icons/react/dist/ssr";

import type { DsIconComponent } from "@/design-system";
import type { PaymentMethod } from "@/types/scheduling";

interface PaymentMethodConfig {
  method: PaymentMethod;
  icon: DsIconComponent;
  label: string;
  description: string;
}

class PaymentConfig {
  static readonly paymentMethods: PaymentMethodConfig[] = [
    {
      method: "credit",
      icon: CreditCard,
      label: "Cartão de crédito",
      description: "Visa, Mastercard, Elo",
    },
    { method: "pix", icon: QrCode, label: "Pix", description: "Pagamento instantâneo" },
    {
      method: "debit",
      icon: DeviceMobileCameraIcon,
      label: "Cartão de débito",
      description: "Débito em conta",
    },
  ];

  static readonly serviceFee = 3;
}

export { PaymentConfig, type PaymentMethodConfig };
