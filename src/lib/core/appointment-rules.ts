class AppointmentRules {
  static readonly cancellationWindowMs = 60 * 60 * 1000;

  static isCancelBlocked(dateTime: string | null, now: number = Date.now()): boolean {
    if (!dateTime) return true;
    // Interpreta string sem timezone como UTC; adiciona offset local para
    // garantir comparação consistente independente do browser/ambiente.
    let appointmentTime = new Date(dateTime).getTime();
    if (Number.isNaN(appointmentTime)) return true;
    // Se a string não tem timezone (formato "yyyy-MM-ddTHH:mm"), ajusta com offset local
    if (!dateTime.includes("Z") && !dateTime.includes("+") && !dateTime.includes("T")) {
      const [datePart, timePart] = dateTime.split(" ");
      appointmentTime = new Date(`${datePart}T${timePart}`).getTime();
    }
    if (Number.isNaN(appointmentTime)) return true;
    return appointmentTime - now < AppointmentRules.cancellationWindowMs;
  }
}

export { AppointmentRules };
