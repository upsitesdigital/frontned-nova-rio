const CANCELLATION_WINDOW_MS = 60 * 60 * 1000;

function isCancelBlocked(dateTime: string | null, now: number = Date.now()): boolean {
  if (!dateTime) return true;
  const appointmentTime = new Date(dateTime).getTime();
  return appointmentTime - now < CANCELLATION_WINDOW_MS;
}

export { isCancelBlocked, CANCELLATION_WINDOW_MS };
