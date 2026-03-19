import { NextRequest, NextResponse } from "next/server";
// import type { NextRequest } from 'next/server';
import { verifyToken } from "@/lib/auth";
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
import { AppError, sendResponse } from "./lib/utils/helper";

const PROTECTED_API_PATTERNS = [
  { regex: /^\/api\/userprofiles\/me$/, methods: ["GET", "PUT"] },
  { regex: /^\/api\/certification(?:\/[^/]+)?$/, methods: ["POST", "GET", "PUT", "DELETE"] },
  { regex: /^\/api\/education(?:\/[^/]+)?$/, methods: ["POST", "GET", "PUT", "DELETE"] },
  { regex: /^\/api\/experience(?:\/[^/]+)?$/, methods: ["POST", "GET", "PUT", "DELETE"] },
  { regex: /^\/api\/review\/[^/]+$/, methods: ["GET"] },
  { regex: /^\/api\/sessions(?:\/.*)?$/, methods: ["POST", "GET", "PUT"] },
];

function shouldProtectApi(pathname: string, method: string): boolean {
  if (pathname === "/api/sessions/google/redirect" && method === "GET") return false;
  return PROTECTED_API_PATTERNS.some((pattern) => pattern.regex.test(pathname) && pattern.methods.includes(method));
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    loginUrl.searchParams.set("reason", "auth_required");
    return NextResponse.redirect(loginUrl);
  }
  // API ROUTES (Prioritize Headers)
  if (pathname.startsWith("/api")) {
    if (!shouldProtectApi(pathname, method)) {
      return NextResponse.next();
    }
    try {
      const payload = verifyToken(token);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload._id);
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (error: any) {
      const status = error.statusCode || HTTP_STATUS.UNAUTHORIZED;
      const message = error.message || "Unauthorized access.";
      const errorType = error.errorType || ERROR_TYPES.UNAUTHORIZED;
      return sendResponse(status, false, null, { message: errorType }, message);
    }
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/api/userprofiles/me",
    "/api/certification/:path*",
    "/api/education/:path*",
    "/api/experience/:path*",
    "/api/review/:reviewId",
    "/api/sessions/:path*",
    "/account/:path*",
    "/mentors/:path*/session"],
};
