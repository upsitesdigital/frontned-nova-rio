import { NextRequest, NextResponse } from "next/server";
import { appConfig } from "@/config/app";

const ADMIN_PATH_PREFIX = "/admin";
const LOGIN_PATH = "/login";
const DASHBOARD_PATH = "/dashboard";
const AUTH_COOKIE = appConfig.authCookieName;

function parseAuthCookie(request: NextRequest): {
  userType: string | null;
} {
  const raw = request.cookies.get(AUTH_COOKIE)?.value;
  if (!raw) {
    return { userType: null };
  }

  try {
    const parsed = JSON.parse(raw) as { state?: { userType?: string } };
    return {
      userType: parsed.state?.userType ?? null,
    };
  } catch {
    return { userType: null };
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ADMIN_PATH_PREFIX)) {
    return NextResponse.next();
  }

  const cookieAuth = parseAuthCookie(request);
  const userType = cookieAuth.userType;

  if (!userType) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  if (userType !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = userType ? DASHBOARD_PATH : LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
