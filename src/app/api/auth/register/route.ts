import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

const API_ORIGIN = (process.env.NEXT_PUBLIC_RECURSIV_URL || "https://api.recursiv.io/api/v1").replace(/\/api\/v1$/, "");

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_ORIGIN}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": API_ORIGIN,
      },
      body: JSON.stringify({ name, email, password }),
    });

    const text = await res.text();
    if (!res.ok) {
      let msg = `Registration failed (${res.status})`;
      try {
        const body = JSON.parse(text);
        msg = body?.message || body?.error?.message || msg;
      } catch {
        if (text) msg = text;
      }
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    const data = text ? JSON.parse(text) : {};

    // Extract session token from Set-Cookie header (signed token)
    const setCookies = res.headers.getSetCookie?.() ?? [];
    let sessionToken: string | null = null;
    for (const cookie of setCookies) {
      const match = cookie.match(/(?:__Secure-)?better-auth\.session_token=([^;]+)/);
      if (match) {
        sessionToken = decodeURIComponent(match[1]);
        break;
      }
    }
    // Fallback to body token
    if (!sessionToken) {
      sessionToken = data.token || data.session?.token || null;
    }

    const response = NextResponse.json({
      user: { id: data.user?.id, email, name },
    });

    if (sessionToken) {
      response.cookies.set("spark_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    sendWelcomeEmail(email, name).catch(console.error);

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
