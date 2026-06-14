class AppointmentRules {
  static readonly cancellationWindowMs = 60 * 60 * 1000;

  static isCancelBlocked(dateTime: string | null, now: number = Date.now()): boolean {
    if (!dateTime) return true;
    const appointmentTime = new Date(dateTime).getTime();
    return appointmentTime - now < AppointmentRules.cancellationWindowMs;
  }
}

export { AppointmentRules };
