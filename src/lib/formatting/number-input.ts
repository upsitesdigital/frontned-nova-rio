export class NumberInput {
  static parseDecimal(value: string): number | null {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const normalized = trimmed.replaceAll(".", "").replace(",", ".");
    const parsed = Number(normalized);

    if (!Number.isFinite(parsed)) return null;
    return parsed;
  }

  static parseInteger(value: string): number | null {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed)) return null;
    return parsed;
  }

  static parsePositiveDecimal(value: string): number | null {
    const cleaned = [...value.trim()].filter((c) => "0123456789.,".includes(c)).join("");
    const sanitized = cleaned.replaceAll(".", "").replace(",", ".");

    if (!sanitized) return null;

    const parsed = Number(sanitized);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }

    return parsed;
  }

  static formatDecimal(value: number): string {
    return value.toFixed(2).replace(".", ",");
  }
}
