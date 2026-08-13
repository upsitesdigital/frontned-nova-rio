function decodeJwtPayload(token: string): { type?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded));
    return payload as { type?: string };
  } catch {
    return null;
  }
}

export { decodeJwtPayload };
