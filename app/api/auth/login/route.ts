import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sign } from "@tsndr/cloudflare-worker-jwt";
import { loginSchema } from "@/common/type/auth";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { username, password } = result.data;

    const usernameMatch = await timingSafeEqual(username, process.env.ADMIN_USERNAME ?? '');
    const passwordMatch = await timingSafeEqual(password, process.env.ADMIN_PASSWORD ?? '');

    if (usernameMatch && passwordMatch) {
      const token = await sign(
        {
          sub: username,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        },
        process.env.JWT_SECRET ?? crypto.randomUUID()
      );

      cookies().set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  if (a.length !== b.length) {
    return false;
  }

  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);

  return crypto.subtle.digest('SHA-256', aBytes).then(aHash => 
    crypto.subtle.digest('SHA-256', bBytes).then(bHash => 
      new Uint8Array(aHash).every((val, i) => val === new Uint8Array(bHash)[i])
    )
  );
}
