interface StartScreenProps {
  onStart: () => void;
  bestStreak: number;
  totalCorrect: number;
}

export function StartScreen({ onStart, bestStreak, totalCorrect }: StartScreenProps) {
  return (
    <div className="animate-bounce-in flex min-h-[50dvh] flex-col items-center justify-center py-4 pb-safe sm:min-h-[60vh] sm:py-8">
      <div className="w-full max-w-lg rounded-3xl border-4 border-indigo-200 bg-gradient-to-br from-white via-indigo-50 to-purple-100 p-5 text-center shadow-2xl shadow-indigo-200/60 sm:p-8">
        <div className="mb-3 text-5xl sm:mb-4 sm:text-7xl" aria-hidden="true">
          🧪⚗️🔬
        </div>

        <h2 className="text-xl font-extrabold text-indigo-950 sm:text-3xl">
          Ready to Hunt?
        </h2>
        <p className="mt-2 text-sm text-slate-600 sm:mt-3 sm:text-lg">
          Use the clues to find the secret element on the periodic table!
        </p>

        <ul className="mt-5 space-y-2 text-left text-sm text-slate-700 sm:mt-6 sm:text-base">
          <li className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2.5">
            <span className="shrink-0" aria-hidden="true">
              🎯
            </span>
            Read the mission clues carefully
          </li>
          <li className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2.5">
            <span className="shrink-0" aria-hidden="true">
              👆
            </span>
            Tap an element to make your guess
          </li>
          <li className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2.5">
            <span className="shrink-0" aria-hidden="true">
              ↔️
            </span>
            Swipe the table on phones to see all elements
          </li>
          <li className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2.5">
            <span className="shrink-0" aria-hidden="true">
              🔥
            </span>
            Build a streak for bonus points!
          </li>
        </ul>

        {(totalCorrect > 0 || bestStreak > 0) && (
          <p className="mt-4 text-sm font-medium text-indigo-700">
            Welcome back! {totalCorrect} found · Best streak: {bestStreak} 🔥
          </p>
        )}

        <button
          type="button"
          onClick={onStart}
          className="animate-wiggle mt-6 min-h-[52px] w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-300/50 touch-manipulation active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 sm:mt-8 sm:text-xl"
        >
          🚀 Start Game!
        </button>
      </div>
    </div>
  );
}
