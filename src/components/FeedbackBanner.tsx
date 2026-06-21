interface FeedbackBannerProps {
  type: "success" | "error" | null;
  message: string;
}

export function FeedbackBanner({ type, message }: FeedbackBannerProps) {
  if (!type || !message) return null;

  const isSuccess = type === "success";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        "animate-slide-up rounded-2xl border-2 px-3 py-3 text-center shadow-lg sm:px-6 sm:py-4",
        isSuccess
          ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-900"
          : "border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-900",
      ].join(" ")}
    >
      <div className="text-2xl sm:text-4xl" aria-hidden="true">
        {isSuccess ? "🎉✨🏆" : "😅💪🧐"}
      </div>
      <p className="mt-2 break-words text-sm font-bold leading-snug sm:text-base">
        {message}
      </p>
      {!isSuccess && (
        <p className="mt-1 text-xs font-medium leading-snug text-orange-700 sm:text-sm">
          Tip: tap &ldquo;How We Solved It&rdquo; to narrow down!
        </p>
      )}
    </div>
  );
}
