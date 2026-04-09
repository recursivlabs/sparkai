import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { anonSdk } from "@/lib/recursiv";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("spark_session")?.value;

  if (!token) {
    return NextResponse.json({ user: null, reason: "no_cookie" }, { status: 401 });
  }

  try {
    const session = await anonSdk.auth.getSession(token);

    if (!session?.user?.id) {
      return NextResponse.json({ user: null, reason: "invalid_session" }, { status: 401 });
    }

    const role = (session.user as Record<string, unknown>).role as string || "community";
    let tier = "community";
    if (role === "arc" || role === "admin") tier = "arc";
    else if (role === "forum") tier = "forum";

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        tier,
      },
    });
  } catch (err) {
    console.error("Session check error:", err);
    return NextResponse.json({ user: null, reason: "error" }, { status: 401 });
  }
}
