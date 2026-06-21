import type { Challenge } from "@/lib/types";

interface MissionCardProps {
  challenge: Challenge;
}

export function MissionCard({ challenge }: MissionCardProps) {
  return (
    <section
      className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 shadow-lg shadow-indigo-100/50 sm:p-5"
      aria-labelledby="mission-title"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">
          🎯
        </span>
        <h2 id="mission-title" className="text-lg font-bold text-indigo-900 sm:text-xl">
          Your Mission
        </h2>
      </div>
      <p className="mb-4 text-sm font-medium text-slate-600 sm:text-base">
        Find an element that:
      </p>
      <ul className="space-y-2.5" role="list">
        {challenge.clues.map((clue) => (
          <li
            key={clue.id}
            className="flex items-start gap-2.5 rounded-xl bg-white/80 px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm sm:text-base"
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white"
              aria-hidden="true"
            >
              ✓
            </span>
            <span>{clue.text.charAt(0).toUpperCase() + clue.text.slice(1)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
