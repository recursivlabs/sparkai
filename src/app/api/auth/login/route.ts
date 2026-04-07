import { NextRequest, NextResponse } from "next/server";

const API_ORIGIN = (process.env.NEXT_PUBLIC_RECURSIV_URL || "https://api.recursiv.io/api/v1").replace(/\/api\/v1$/, "");

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_ORIGIN}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": API_ORIGIN,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const msg = body?.message || body?.error?.message || "Invalid email or password";
      return NextResponse.json({ error: msg }, { status: 401 });
    }

    // Extract the session token from Set-Cookie header
    const setCookies = res.headers.getSetCookie?.() ?? [];
    let sessionToken: string | null = null;
    for (const cookie of setCookies) {
      // Match both "better-auth.session_token" and "__Secure-better-auth.session_token"
      const match = cookie.match(/(?:__Secure-)?better-auth\.session_token=([^;]+)/);
      if (match) {
        sessionToken = decodeURIComponent(match[1]);
        break;
      }
    }

    // Fallback to body token
    if (!sessionToken) {
      const data = await res.json().catch(() => null);
      sessionToken = data?.token || data?.session?.token || null;
    }

    if (!sessionToken) {
      return NextResponse.json({ error: "Login succeeded but no session token received" }, { status: 500 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("spark_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
