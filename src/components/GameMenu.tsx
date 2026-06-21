interface GameMenuProps {
  open: boolean;
  onClose: () => void;
  onRestart: () => void;
  onBackToStart: () => void;
}

export function GameMenu({
  open,
  onClose,
  onRestart,
  onBackToStart,
}: GameMenuProps) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm touch-manipulation"
        aria-label="Close menu"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-menu-title"
        className="animate-bounce-in fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t-4 border-indigo-200 bg-white p-5 pb-safe shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-h-none sm:w-[min(90vw,360px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:border-4 sm:p-6"
      >
        <div
          className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden"
          aria-hidden="true"
        />

        <h2
          id="game-menu-title"
          className="mb-1 text-center text-xl font-bold text-indigo-950"
        >
          Test Menu
        </h2>
        <p className="mb-5 text-center text-sm text-slate-500">
          Choose where to go next.
        </p>

        <div className="space-y-3">
          <MenuButton
            label="Restart Test"
            description="Start a fresh set of questions"
            onClick={() => {
              onRestart();
              onClose();
            }}
          />
          <MenuButton
            label="Back to Start"
            description="Return to the home screen"
            onClick={() => {
              onBackToStart();
              onClose();
            }}
            variant="muted"
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full min-h-[44px] rounded-xl py-3 text-sm font-semibold text-slate-500 touch-manipulation active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          Continue Test
        </button>
      </div>
    </>
  );
}

function MenuButton({
  label,
  description,
  onClick,
  variant = "default",
}: {
  label: string;
  description: string;
  onClick: () => void;
  variant?: "default" | "muted";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex min-h-[56px] w-full items-center rounded-2xl border-2 px-4 py-3 text-left touch-manipulation transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400",
        variant === "default"
          ? "border-indigo-100 bg-indigo-50 active:bg-indigo-100"
          : "border-slate-200 bg-slate-50 active:bg-slate-100",
      ].join(" ")}
    >
      <span>
        <span className="block font-bold text-slate-800">{label}</span>
        <span className="block text-xs text-slate-500">{description}</span>
      </span>
    </button>
  );
}