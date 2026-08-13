import { NextRequest, NextResponse } from "next/server";
import { AppConfig } from "@/config/app";

const adminPathPrefix = "/admin";
const loginPath = "/login";
const dashboardPath = "/dashboard";
const authCookie = AppConfig.authCookieName;

function parseAuthCookie(request: NextRequest): {
  userType: string | null;
} {
  const raw = request.cookies.get(authCookie)?.value;
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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(adminPathPrefix)) {
    return NextResponse.next();
  }

  const cookieAuth = parseAuthCookie(request);
  const userType = cookieAuth.userType;

  if (!userType) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    return NextResponse.redirect(url);
  }

  if (userType !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = userType ? dashboardPath : loginPath;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
