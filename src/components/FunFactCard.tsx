interface FunFactCardProps {
  elementName: string;
  funFact: string;
  visible: boolean;
}

export function FunFactCard({ elementName, funFact, visible }: FunFactCardProps) {
  if (!visible) return null;

  return (
    <section
      className="animate-slide-up rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 p-5 shadow-lg"
      aria-live="polite"
      aria-labelledby="funfact-title"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="animate-wiggle text-2xl" aria-hidden="true">
          💡
        </span>
        <h2 id="funfact-title" className="text-lg font-bold text-amber-900">
          Did You Know? 🌟
        </h2>
      </div>
      <p className="text-sm leading-relaxed text-amber-950 sm:text-base">
        <strong>{elementName}</strong> — {funFact}
      </p>
    </section>
  );
}
