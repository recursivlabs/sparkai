import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_ORIGIN = (process.env.NEXT_PUBLIC_RECURSIV_URL || "https://api.recursiv.io/api/v1").replace(/\/api\/v1$/, "");

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("spark_session")?.value;

  if (!token) {
    return NextResponse.json({ user: null, reason: "no_cookie" }, { status: 401 });
  }

  try {
    // Send both cookie formats — Better Auth uses __Secure- prefix in production
    const res = await fetch(`${API_ORIGIN}/api/auth/get-session`, {
      headers: {
        "Origin": API_ORIGIN,
        "Cookie": `__Secure-better-auth.session_token=${encodeURIComponent(token)}; better-auth.session_token=${encodeURIComponent(token)}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ user: null, reason: "invalid_session" }, { status: 401 });
    }

    const text = await res.text();
    if (!text || text === "null") {
      return NextResponse.json({ user: null, reason: "empty_response" }, { status: 401 });
    }

    const data = JSON.parse(text);
    const user = data.user || data.session?.user;

    if (!user?.id) {
      return NextResponse.json({ user: null, reason: "no_user" }, { status: 401 });
    }

    const role = user.role || "community";
    let tier = "community";
    if (role === "arc" || role === "admin") tier = "arc";
    else if (role === "forum") tier = "forum";

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        tier,
      },
    });
  } catch (err) {
    console.error("Session check error:", err);
    return NextResponse.json({ user: null, reason: "error" }, { status: 401 });
  }
}
