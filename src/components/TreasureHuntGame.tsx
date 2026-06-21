"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { computeFilterSteps, pickRandomChallenge } from "@/lib/challenges";
import { getElementByNumber } from "@/lib/elements";
import { pickSuccessMessage, pickWrongMessage } from "@/lib/messages";
import { DEFAULT_STATS, loadStats, saveStats } from "@/lib/storage";
import type { Challenge, GameStats } from "@/lib/types";
import { ComputationalThinkingPanel } from "./ComputationalThinkingPanel";
import { ConfettiBurst } from "./ConfettiBurst";
import { FeedbackBanner } from "./FeedbackBanner";
import { FloatingEmojis } from "./FloatingEmojis";
import { FunFactCard } from "./FunFactCard";
import { GameMenu } from "./GameMenu";
import { MissionCard } from "./MissionCard";
import { PeriodicTable } from "./PeriodicTable";
import { ScoreBoard } from "./ScoreBoard";
import { StartScreen } from "./StartScreen";

const POINTS_PER_CORRECT = 100;
const STREAK_BONUS = 25;

type GamePhase = "start" | "playing";

export function TreasureHuntGame() {
  const [phase, setPhase] = useState<GamePhase>("start");
  const [menuOpen, setMenuOpen] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [successElement, setSuccessElement] = useState<number | null>(null);
  const [errorElement, setErrorElement] = useState<number | null>(null);
  const [funFact, setFunFact] = useState<{
    name: string;
    text: string;
  } | null>(null);
  const [locked, setLocked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSadEmojis, setShowSadEmojis] = useState(false);
  const [celebrationKey, setCelebrationKey] = useState(0);

  const filterSteps = useMemo(
    () => (challenge ? computeFilterSteps(challenge) : []),
    [challenge]
  );

  const resetAttempt = useCallback(() => {
    setFeedback({ type: null, message: "" });
    setSuccessElement(null);
    setErrorElement(null);
    setFunFact(null);
    setLocked(false);
    setShowConfetti(false);
    setShowSadEmojis(false);
  }, []);

  const startNewChallenge = useCallback(
    (excludeId?: string) => {
      const next = pickRandomChallenge(excludeId);
      setChallenge(next);
      resetAttempt();
    },
    [resetAttempt]
  );

  useEffect(() => {
    setStats(loadStats());
  }, []);

  useEffect(() => {
    if (phase === "playing") {
      saveStats(stats);
    }
  }, [stats, phase]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const handleStartGame = useCallback(() => {
    setPhase("playing");
    startNewChallenge();
  }, [startNewChallenge]);

  const handleRetryMission = useCallback(() => {
    resetAttempt();
  }, [resetAttempt]);

  const handleNewMission = useCallback(() => {
    startNewChallenge(challenge?.id);
  }, [challenge?.id, startNewChallenge]);

  const handleBackToStart = useCallback(() => {
    setPhase("start");
    setMenuOpen(false);
    resetAttempt();
    setChallenge(null);
  }, [resetAttempt]);

  const handleSelect = useCallback(
    (atomicNumber: number) => {
      if (!challenge || locked || phase !== "playing") return;

      const selected = getElementByNumber(atomicNumber);
      if (!selected) return;

      if (atomicNumber === challenge.answer) {
        setLocked(true);
        setSuccessElement(atomicNumber);
        setFunFact({ name: selected.name, text: selected.funFact });
        setCelebrationKey((k) => k + 1);
        setShowConfetti(true);

        let newStreak = 0;
        let streakBonus = 0;

        setStats((prev) => {
          newStreak = prev.currentStreak + 1;
          streakBonus =
            newStreak > 1 ? STREAK_BONUS * (newStreak - 1) : 0;
          return {
            score: prev.score + POINTS_PER_CORRECT + streakBonus,
            correctAnswers: prev.correctAnswers + 1,
            currentStreak: newStreak,
            bestStreak: Math.max(prev.bestStreak, newStreak),
          };
        });

        const bonusText =
          streakBonus > 0 ? ` (+${streakBonus} streak bonus!)` : "";
        setFeedback({
          type: "success",
          message: `${pickSuccessMessage(newStreak)} You found ${selected.name} (${selected.symbol})! +${POINTS_PER_CORRECT}${bonusText}`,
        });

        window.setTimeout(() => {
          setShowConfetti(false);
          setFunFact(null);
          startNewChallenge(challenge.id);
        }, 4000);
      } else {
        setErrorElement(atomicNumber);
        setShowSadEmojis(true);
        setStats((prev) => ({
          ...prev,
          currentStreak: 0,
        }));
        setFeedback({
          type: "error",
          message: `${pickWrongMessage()} (${selected.name} isn't the treasure.)`,
        });

        window.setTimeout(() => {
          setErrorElement(null);
          setShowSadEmojis(false);
          setFeedback({ type: null, message: "" });
        }, 2800);
      }
    },
    [challenge, locked, phase, startNewChallenge]
  );

  if (phase === "start") {
    return (
      <StartScreen
        onStart={handleStartGame}
        bestStreak={stats.bestStreak}
        totalCorrect={stats.correctAnswers}
      />
    );
  }

  if (!challenge) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <>
      <ConfettiBurst
        key={celebrationKey}
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
      <FloatingEmojis active={showSadEmojis} />

      <GameMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onRetry={handleRetryMission}
        onNewMission={handleNewMission}
        onBackToStart={handleBackToStart}
      />

      {/* Sticky mobile score bar */}
      <div className="sticky top-0 z-30 -mx-4 mb-4 border-b border-indigo-100 bg-white/95 px-4 py-2.5 backdrop-blur-md sm:static sm:mx-0 sm:mb-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1 sm:hidden">
            <ScoreBoard stats={stats} compact />
          </div>
          <div className="hidden sm:block sm:flex-1">
            <ScoreBoard stats={stats} />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="hidden h-11 min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-2xl border-2 border-indigo-200 bg-white px-5 text-sm font-bold text-indigo-700 shadow-sm touch-manipulation active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 sm:flex"
            aria-haspopup="dialog"
            aria-label="Open game menu"
          >
            <span aria-hidden="true">☰</span>
            Menu
          </button>
        </div>
      </div>

      <div className="space-y-4 pb-24 sm:space-y-6 sm:pb-0">
        {stats.currentStreak >= 3 && !locked && (
          <p className="animate-wiggle text-center text-sm font-bold text-orange-600 sm:text-base">
            🔥 {stats.currentStreak} streak! Keep it going!
          </p>
        )}

        <FeedbackBanner type={feedback.type} message={feedback.message} />

        <FunFactCard
          elementName={funFact?.name ?? ""}
          funFact={funFact?.text ?? ""}
          visible={!!funFact}
        />

        <div className="grid gap-4 lg:grid-cols-[320px_1fr] lg:gap-6 xl:grid-cols-[360px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-6 lg:space-y-6 lg:self-start">
            <MissionCard challenge={challenge} />
            <ComputationalThinkingPanel steps={filterSteps} />
          </aside>

          <main className="min-w-0">
            <PeriodicTable
              onSelect={handleSelect}
              disabled={locked}
              successElement={successElement}
              errorElement={errorElement}
            />
          </main>
        </div>
      </div>

      {/* Mobile floating menu button for easy thumb reach */}
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="fixed bottom-5 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full border-2 border-indigo-300 bg-indigo-600 text-2xl text-white shadow-lg shadow-indigo-400/40 touch-manipulation active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 sm:hidden pb-safe-offset"
        aria-label="Open game menu"
      >
        <span aria-hidden="true">☰</span>
      </button>
    </>
  );
}
