import IMask from "imask";

export class Formatters {
  private static readonly digitsMask = IMask.createMask({ mask: "0".repeat(32) });
  private static readonly cepMask = IMask.createMask({ mask: "00000-000" });
  private static readonly phoneMask = IMask.createMask({ mask: "(00) 00000-0000" });
  private static readonly cardMask = IMask.createMask({ mask: "0000 0000 0000 0000" });
  private static readonly expiryMask = IMask.createMask({ mask: "00/00" });
  private static readonly cpfCnpjMask = IMask.createMask({
    mask: [{ mask: "000.000.000-00" }, { mask: "00.000.000/0000-00" }],
  });

  private static apply(
    mask: { resolve: (v: string) => void; value: string },
    value: string,
  ): string {
    mask.resolve(value);
    return mask.value;
  }

  static formatPrice(price: number): string {
    return `A partir de R$ ${price.toFixed(2).replace(".", ",")}`;
  }

  static formatCep(value: string): string {
    return Formatters.apply(Formatters.cepMask, value);
  }

  static formatPhone(value: string): string {
    return Formatters.apply(Formatters.phoneMask, value);
  }

  static formatCardNumber(value: string): string {
    return Formatters.apply(Formatters.cardMask, value);
  }

  static formatExpiry(value: string): string {
    return Formatters.apply(Formatters.expiryMask, value);
  }

  static formatCpfCnpj(value: string): string {
    return Formatters.apply(Formatters.cpfCnpjMask, value);
  }

  static formatCurrency(value: number): string {
    return `R$${value.toFixed(2).replace(".", ",")}`;
  }

  static onlyDigits(value: string): string {
    return Formatters.apply(Formatters.digitsMask, value);
  }

  static stripDdi(value: string): string {
    const digits = Formatters.onlyDigits(value);
    if (digits.length > 11 && digits.startsWith("55")) {
      return digits.slice(2);
    }
    return digits;
  }
}
