import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATH_PREFIX = "/admin";
const LOGIN_PATH = "/login";
const DASHBOARD_PATH = "/dashboard";
const AUTH_COOKIE = "nova-rio-auth";

function parseAuthCookie(request: NextRequest): { userType: string | null; accessToken: string | null } {
  const raw = request.cookies.get(AUTH_COOKIE)?.value;
  if (!raw) {
    // Zustand persist uses localStorage by default, not cookies.
    // Fall back to checking the header if the client sends it.
    return { userType: null, accessToken: null };
  }

  try {
    const parsed = JSON.parse(raw) as { state?: { userType?: string; accessToken?: string } };
    return {
      userType: parsed.state?.userType ?? null,
      accessToken: parsed.state?.accessToken ?? null,
    };
  } catch {
    return { userType: null, accessToken: null };
  }
}

function decodeJwtPayload(token: string): { type?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as { type?: string };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ADMIN_PATH_PREFIX)) {
    return NextResponse.next();
  }

  // Try to determine user type from JWT in Authorization header or cookie
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  // Also check cookie-based auth (for SSR page navigations)
  const cookieAuth = parseAuthCookie(request);
  const accessToken = token ?? cookieAuth.accessToken;

  if (!accessToken) {
    // No token at all — redirect to login
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  // Decode JWT to check user type (no verification — backend handles that)
  const payload = decodeJwtPayload(accessToken);
  const userType = payload?.type ?? cookieAuth.userType;

  if (userType && userType !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = DASHBOARD_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
