function decodeJwtPayload(token: string): { type?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload as { type?: string };
  } catch {
    return null;
  }
}

export { decodeJwtPayload };
