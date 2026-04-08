import { cookies } from "next/headers";
import { getRecursiv } from "./recursiv";
import type { MembershipTier } from "./tiers";

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
    const r = getRecursiv();
    const session = await r.auth.getSession(token);

    if (!session?.user?.id) return null;

    const role = (session.user as Record<string, unknown>).role as string || "community";
    let tier: MembershipTier = "community";
    if (role === "arc" || role === "admin") tier = "arc";
    else if (role === "forum") tier = "forum";

    return {
      id: session.user.id,
      name: session.user.name || "",
      email: session.user.email || "",
      tier,
    };
  } catch {
    return null;
  }
}
