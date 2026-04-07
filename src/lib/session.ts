import { cookies } from "next/headers";
import type { MembershipTier } from "./tiers";

const API_ORIGIN = (process.env.NEXT_PUBLIC_RECURSIV_URL || "https://api.recursiv.io/api/v1").replace(/\/api\/v1$/, "");

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  tier: MembershipTier;
}

/**
 * Get the current user from the session cookie (server-side only).
 * Returns null if not authenticated.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("spark_session")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_ORIGIN}/api/auth/get-session`, {
      headers: {
        "Origin": API_ORIGIN,
        "Cookie": `__Secure-better-auth.session_token=${encodeURIComponent(token)}; better-auth.session_token=${encodeURIComponent(token)}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const text = await res.text();
    if (!text || text === "null") return null;

    const data = JSON.parse(text);
    const user = data.user || data.session?.user;
    if (!user?.id) return null;

    const role = user.role || "community";
    let tier: MembershipTier = "community";
    if (role === "arc" || role === "admin") tier = "arc";
    else if (role === "forum") tier = "forum";

    return {
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      tier,
    };
  } catch {
    return null;
  }
}
