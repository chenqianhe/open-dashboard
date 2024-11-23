import { verify } from "@tsndr/cloudflare-worker-jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Constants for route management
const PROTECTED_ROUTES = ["/config", "/batches", "/files"];
const PROTECTED_API_ROUTES = ["/api/config", "/api/batches", "/api/files"];
const PUBLIC_ROUTES = ["/"];
const PUBLIC_API_ROUTES = ["/api/auth"];
const DEFAULT_REDIRECT = "/";

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    const isAuthenticated = token ? await checkAuth(token) : false;
    const isApiRoute = pathname.startsWith("/api");

    // Handle API routes
    if (isApiRoute) {
      // Allow public API routes
      if (PUBLIC_API_ROUTES.includes(pathname)) {
        return NextResponse.next();
      }

      // Check authentication for protected API routes
      if (!isAuthenticated) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      return NextResponse.next();
    }

    // Handle page routes
    if (isAuthenticated && pathname === DEFAULT_REDIRECT) {
      return NextResponse.redirect(new URL("/config", request.url));
    }

    if (!isAuthenticated && PROTECTED_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware Error]:", error);
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }
}

async function checkAuth(token: string): Promise<boolean> {
  return true;
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const verified = await verify(token, process.env.JWT_SECRET);
    return !!verified;
  } catch (error) {
    console.error("[Auth Error]:", error);
    return false;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
