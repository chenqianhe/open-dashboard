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

    const usernameMatch = username === process.env.ADMIN_USERNAME;
    const passwordMatch = password === process.env.ADMIN_PASSWORD;

    if (usernameMatch && passwordMatch) {
      console.log(process.env.JWT_SECRET, username, password);
      const token = await sign(
        {
          sub: username,
          name: username,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        },
        process.env.JWT_SECRET
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
