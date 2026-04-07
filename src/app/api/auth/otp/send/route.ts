import { NextResponse } from "next/server";

const API_ORIGIN = (process.env.NEXT_PUBLIC_RECURSIV_URL || "https://api.recursiv.io/api/v1").replace(/\/api\/v1$/, "");

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const res = await fetch(`${API_ORIGIN}/api/auth/email-otp/send-verification-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": API_ORIGIN,
      },
      body: JSON.stringify({ email, type: "sign-in" }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const msg = body?.message || body?.error?.message || "Failed to send code";
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
