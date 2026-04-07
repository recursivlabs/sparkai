import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getRecursiv } from "@/lib/recursiv";
import { ORG_ID } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const { tier } = await req.json();
    if (tier !== "forum" && tier !== "arc") {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const r = getRecursiv();

    // Create a Stripe checkout session via Recursiv billing
    // Uses the org ID (not user ID) — prices are configured in Recursiv org settings
    const { data } = await r.billing.createCheckoutSession({
      organization_id: ORG_ID,
      return_url: `${req.nextUrl.origin}/member/dashboard?upgraded=${tier}`,
    });

    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
