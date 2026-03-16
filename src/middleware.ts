import { NextRequest, NextResponse } from "next/server";
import { appConfig } from "@/config/app";
import { decodeJwtPayload } from "@/lib/jwt-helpers";

const ADMIN_PATH_PREFIX = "/admin";
const LOGIN_PATH = "/login";
const DASHBOARD_PATH = "/dashboard";
const AUTH_COOKIE = appConfig.authCookieName;

function parseAuthCookie(request: NextRequest): {
  userType: string | null;
  accessToken: string | null;
} {
  const raw = request.cookies.get(AUTH_COOKIE)?.value;
  if (!raw) {
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ADMIN_PATH_PREFIX)) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const cookieAuth = parseAuthCookie(request);
  const accessToken = token ?? cookieAuth.accessToken;

  if (!accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  const payload = decodeJwtPayload(accessToken);
  const userType = payload?.type ?? cookieAuth.userType;

  if (!userType || userType !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = userType ? DASHBOARD_PATH : LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
