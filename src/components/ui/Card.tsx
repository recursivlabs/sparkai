import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  accent?: "blue" | "purple" | "green" | "cyan" | "pink" | "amber";
  className?: string;
  hover?: boolean;
  /** Use the feature card variant with gradient bg and hover scale */
  feature?: boolean;
}

const ACCENT_HOVER_BORDERS: Record<string, string> = {
  blue: "hover:border-blue-500/50",
  purple: "hover:border-purple-500/50",
  green: "hover:border-green-500/50",
  cyan: "hover:border-cyan-500/50",
  pink: "hover:border-pink-500/50",
  amber: "hover:border-amber-500/50",
};

export default function Card({
  children,
  accent,
  className = "",
  hover = true,
  feature = false,
}: CardProps) {
  const accentClass = accent ? `card-${accent}` : "";

  if (feature) {
    const hoverBorder = accent ? ACCENT_HOVER_BORDERS[accent] : "";
    return (
      <div
        className={`bg-gradient-to-br from-slate-900/90 to-slate-800/50 rounded-2xl border border-slate-700/50 p-8 transition-all duration-500 hover:scale-[1.02] ${hoverBorder} ${accentClass} ${className}`}
      >
        {children}
      </div>
    );
  }

  const hoverClass = hover ? "hover:bg-card-hover" : "";

  return (
    <div
      className={`bg-card rounded-xl border border-border p-6 transition-colors ${accentClass} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}
