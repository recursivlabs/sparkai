"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import type { MembershipTier } from "@/lib/tiers";

interface TierGateProps {
  children: ReactNode;
  requiredTier: MembershipTier;
  currentTier?: MembershipTier | null;
  label?: string;
}

const TIER_ORDER: Record<MembershipTier, number> = {
  community: 0,
  forum: 1,
  arc: 2,
};

export default function TierGate({
  children,
  requiredTier,
  currentTier,
  label,
}: TierGateProps) {
  const hasAccess =
    currentTier && TIER_ORDER[currentTier] >= TIER_ORDER[requiredTier];

  if (hasAccess) {
    return <>{children}</>;
  }

  const tierLabels: Record<MembershipTier, string> = {
    community: "Community",
    forum: "Executive Forum",
    arc: "ARC Sponsors",
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl z-10 flex flex-col items-center justify-center p-6 text-center">
        <Lock className="w-8 h-8 text-muted mb-3" />
        <p className="text-white font-semibold mb-1">
          {label || `${tierLabels[requiredTier]} Access Required`}
        </p>
        <p className="text-muted text-sm mb-4">
          This content is available to {tierLabels[requiredTier]} members and above.
        </p>
        {!currentTier ? (
          <Link
            href="/auth/register"
            className="px-4 py-2 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Join SPARK AI
          </Link>
        ) : (
          <Link
            href="/sponsorship"
            className="px-4 py-2 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Upgrade Membership
          </Link>
        )}
      </div>
      <div className="opacity-20 pointer-events-none">{children}</div>
    </div>
  );
}
