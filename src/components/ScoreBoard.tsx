"use client";

import type { GameStats } from "@/lib/types";

interface ScoreBoardProps {
  stats: GameStats;
  compact?: boolean;
}

export function ScoreBoard({ stats, compact = false }: ScoreBoardProps) {
  const items = [
    { label: "Score", value: stats.score, icon: "⭐", accent: "text-amber-600" },
    {
      label: "Correct",
      value: stats.correctAnswers,
      icon: "✅",
      accent: "text-emerald-600",
    },
    {
      label: "Streak",
      value: stats.currentStreak,
      icon: "🔥",
      accent: "text-orange-600",
    },
  ];

  return (
    <section
      className={[
        "grid grid-cols-3",
        compact ? "gap-1.5" : "gap-2 sm:gap-4",
      ].join(" ")}
      aria-label="Score tracking"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={[
            "rounded-xl border border-slate-200 bg-white text-center shadow-sm sm:rounded-2xl",
            compact ? "px-2 py-2" : "px-3 py-3 sm:px-4 sm:py-4",
          ].join(" ")}
        >
          <div
            className={compact ? "text-sm" : "text-lg sm:text-xl"}
            aria-hidden="true"
          >
            {item.icon}
          </div>
          <div
            className={[
              "font-bold",
              item.accent,
              compact ? "text-base" : "text-xl sm:text-2xl",
            ].join(" ")}
          >
            {item.value}
          </div>
          <div
            className={[
              "font-medium text-slate-500",
              compact ? "text-[10px]" : "text-xs sm:text-sm",
            ].join(" ")}
          >
            {item.label}
          </div>
        </div>
      ))}
    </section>
  );
}
