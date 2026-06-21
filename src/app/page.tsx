import { TreasureHuntGame } from "@/components/TreasureHuntGame";

export default function Home() {
  return (
    <div className="flex min-h-screen min-h-dvh flex-col">
      <header className="border-b border-indigo-100 bg-white/80 pt-safe backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          <h1 className="flex items-start gap-2 text-xl font-extrabold leading-tight tracking-tight text-indigo-950 sm:items-center sm:text-3xl lg:text-4xl">
            <span className="shrink-0 text-2xl sm:text-3xl" aria-hidden="true">
              🔎
            </span>
            <span>
              Periodic Table
              <span className="block sm:inline sm:ml-1">Treasure Hunt</span>
            </span>
          </h1>
          <p className="mt-1.5 text-xs font-medium text-slate-600 sm:text-base">
            Answer 10 element questions using clues from the periodic table.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        <TreasureHuntGame />
      </main>

      <footer className="border-t border-slate-200 bg-white/60 px-3 py-3 pb-safe text-center text-[11px] text-slate-500 sm:py-4 sm:text-xs">
        Built for Class 8 science · Demonstrating filtering, classification
        &amp; pattern recognition
      </footer>
    </div>
  );
}
