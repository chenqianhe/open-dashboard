import { verify } from "@tsndr/cloudflare-worker-jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/config"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  const isAuthenticated = token ? await checkAuth(token) : false;

  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/config", request.url));
  }

  if (!isAuthenticated && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

async function checkAuth(token: string): Promise<boolean> {
  return true;
  try {
    const verified = await verify(token, process.env.JWT_SECRET);
    return !!verified;
  } catch {
    return false;
  }
}

export const config = {
  matcher: [
    "/",
    "/config",
  ],
};
