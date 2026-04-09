import { NextResponse } from "next/server";
import { anonSdk } from "@/lib/recursiv";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    console.log(`OTP verify attempt for ${email}`);
    const session = await anonSdk.auth.verifyOtp({ email, otp });
    console.log(`OTP verify result: token=${session.token ? 'YES' : 'NO'}, user=${session.user?.email || 'none'}`);

    if (!session.token) {
      console.error('OTP verify succeeded but no token returned');
      return NextResponse.json({ error: "Verification succeeded but no session token received" }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      user: session.user ? { id: session.user.id, email: session.user.email, name: session.user.name } : null,
    });

    response.cookies.set("spark_session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
