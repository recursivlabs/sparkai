import { NextResponse } from "next/server";

const API_ORIGIN = (process.env.NEXT_PUBLIC_RECURSIV_URL || "https://api.recursiv.io/api/v1").replace(/\/api\/v1$/, "");

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const res = await fetch(`${API_ORIGIN}/api/auth/sign-in/email-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": API_ORIGIN,
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const msg = body?.message || body?.error?.message || "Invalid or expired code";
      return NextResponse.json({ error: msg }, { status: 401 });
    }

    const data = await res.json();

    // Extract session token from Set-Cookie or body
    const setCookies = res.headers.getSetCookie?.() ?? [];
    let sessionToken: string | null = null;
    for (const cookie of setCookies) {
      const match = cookie.match(/(?:__Secure-)?better-auth\.session_token=([^;]+)/);
      if (match) {
        sessionToken = decodeURIComponent(match[1]);
        break;
      }
    }
    if (!sessionToken) {
      sessionToken = data?.token || data?.session?.token || null;
    }

    if (!sessionToken) {
      return NextResponse.json({ error: "Verification succeeded but no session token received" }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      user: data.user ? { id: data.user.id, email: data.user.email, name: data.user.name } : null,
    });

    response.cookies.set("spark_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
