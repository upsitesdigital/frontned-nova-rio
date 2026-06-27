class HolidayTypeLabel {
  private static readonly labels: Record<string, string> = {
    national: "Nacional",
    regional: "Regional",
    municipal: "Municipal",
    state: "Estadual",
  };

  static format(type: string): string {
    return HolidayTypeLabel.labels[type.toLowerCase()] ?? type;
  }
}

export { HolidayTypeLabel };
