"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { pickRandomChallenges } from "@/lib/challenges";
import { getElementByNumber } from "@/lib/elements";
import { DEFAULT_STATS, loadStats } from "@/lib/storage";
import type { Challenge, GameStats } from "@/lib/types";
import { GameMenu } from "./GameMenu";
import { MissionCard } from "./MissionCard";
import { PeriodicTable } from "./PeriodicTable";
import { StartScreen } from "./StartScreen";

const TEST_LENGTH = 10;
const POINTS_PER_CORRECT = 100;

type GamePhase = "start" | "playing" | "results";

type AnswerRecord = {
  challenge: Challenge;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
};

export function TreasureHuntGame() {
  const [phase, setPhase] = useState<GamePhase>("start");
  const [menuOpen, setMenuOpen] = useState(false);
  const [questions, setQuestions] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [savedStats, setSavedStats] = useState<GameStats>(DEFAULT_STATS);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const challenge = questions[currentIndex] ?? null;
  const correctCount = useMemo(
    () => answers.filter((answer) => answer.isCorrect).length,
    [answers]
  );
  const wrongAnswers = useMemo(
    () => answers.filter((answer) => !answer.isCorrect),
    [answers]
  );

  const resetQuestionState = useCallback(() => {
    setSelectedElement(null);
    setLocked(false);
  }, []);

  const startNewGame = useCallback(() => {
    setQuestions(pickRandomChallenges(TEST_LENGTH));
    setCurrentIndex(0);
    setAnswers([]);
    resetQuestionState();
    setMenuOpen(false);
    setPhase("playing");
  }, [resetQuestionState]);

  useEffect(() => {
    setSavedStats(loadStats());
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const handleBackToStart = useCallback(() => {
    setPhase("start");
    setMenuOpen(false);
    resetQuestionState();
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
  }, [resetQuestionState]);

  const handleSelect = useCallback(
    (atomicNumber: number) => {
      if (!challenge || locked || phase !== "playing") return;

      const selected = getElementByNumber(atomicNumber);
      const correct = getElementByNumber(challenge.answer);
      if (!selected || !correct) return;

      setSelectedElement(atomicNumber);
      setLocked(true);
      setAnswers((prev) => [
        ...prev,
        {
          challenge,
          selectedAnswer: atomicNumber,
          correctAnswer: challenge.answer,
          isCorrect: atomicNumber === challenge.answer,
        },
      ]);
    },
    [challenge, locked, phase]
  );

  const handleContinue = useCallback(() => {
    if (!locked) return;

    if (currentIndex >= questions.length - 1) {
      resetQuestionState();
      setPhase("results");
      return;
    }

    setCurrentIndex((index) => index + 1);
    resetQuestionState();
  }, [currentIndex, locked, questions.length, resetQuestionState]);

  if (phase === "start") {
    return (
      <StartScreen
        onStart={startNewGame}
        bestStreak={savedStats.bestStreak}
        totalCorrect={savedStats.correctAnswers}
      />
    );
  }

  if (phase === "results") {
    return (
      <section className="mx-auto max-w-3xl animate-bounce-in rounded-3xl border-4 border-indigo-200 bg-white p-5 shadow-2xl shadow-indigo-100 sm:p-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
            Test complete
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-indigo-950 sm:text-5xl">
            {correctCount} / {questions.length}
          </h2>
          <p className="mt-2 text-base font-medium text-slate-600 sm:text-lg">
            Score: {correctCount * POINTS_PER_CORRECT} points
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <h3 className="text-lg font-bold text-slate-900">Answers to review</h3>
          {wrongAnswers.length === 0 ? (
            <p className="mt-2 text-sm font-medium text-slate-600">
              Perfect score. Every answer was correct.
            </p>
          ) : (
            <ul className="mt-4 space-y-3" role="list">
              {wrongAnswers.map((answer, index) => {
                const selected = getElementByNumber(answer.selectedAnswer);
                const correct = getElementByNumber(answer.correctAnswer);
                return (
                  <li
                    key={`${answer.challenge.id}-${index}`}
                    className="rounded-2xl bg-white p-3 shadow-sm sm:p-4"
                  >
                    <p className="text-sm font-semibold text-slate-700">
                      Question {answers.indexOf(answer) + 1}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Your answer: {selected?.name ?? "Unknown"} ({selected?.symbol ?? "?"})
                    </p>
                    <p className="text-sm font-bold text-indigo-800">
                      Correct answer: {correct?.name ?? "Unknown"} ({correct?.symbol ?? "?"})
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={startNewGame}
            className="min-h-[52px] rounded-2xl bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-lg shadow-indigo-200 touch-manipulation active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400"
          >
            New Game
          </button>
          <button
            type="button"
            onClick={handleBackToStart}
            className="min-h-[52px] rounded-2xl border-2 border-slate-200 bg-white px-6 py-3 text-base font-bold text-slate-700 touch-manipulation active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400"
          >
            Back to Start
          </button>
        </div>
      </section>
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
      <GameMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onRestart={startNewGame}
        onBackToStart={handleBackToStart}
      />

      <div className="sticky top-0 z-30 -mx-4 mb-4 border-b border-indigo-100 bg-white/95 px-4 py-2.5 backdrop-blur-md sm:static sm:mx-0 sm:mb-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1 rounded-2xl border border-indigo-100 bg-white px-3 py-2 shadow-sm sm:px-4 sm:py-3">
            <p className="text-sm font-bold text-indigo-700 sm:text-base">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <p className="text-xs font-medium text-slate-500 sm:text-sm">
              {answers.length} answered
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="hidden h-11 min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-2xl border-2 border-indigo-200 bg-white px-5 text-sm font-bold text-indigo-700 shadow-sm touch-manipulation active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 sm:flex"
            aria-haspopup="dialog"
            aria-label="Open game menu"
          >
            Menu
          </button>
        </div>
      </div>

      <div className="space-y-4 pb-24 sm:space-y-6 sm:pb-0">
        <div className="rounded-2xl border border-indigo-100 bg-white/80 px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-indigo-700 sm:text-base">
              Pick one element, then move to the next question.
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 sm:w-64">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-orange-400 transition-all duration-300"
                style={{ width: `${((currentIndex + (locked ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr] lg:gap-6 xl:grid-cols-[360px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <MissionCard challenge={challenge} />
            {locked && (
              <button
                type="button"
                onClick={handleContinue}
                className="min-h-[52px] w-full rounded-2xl bg-indigo-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-indigo-200 touch-manipulation active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400"
              >
                {currentIndex >= questions.length - 1 ? "Show Score" : "Next Question"}
              </button>
            )}
          </aside>

          <main className="min-w-0">
            <PeriodicTable
              onSelect={handleSelect}
              disabled={locked}
              selectedElement={selectedElement}
            />
          </main>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="fixed bottom-5 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full border-2 border-indigo-300 bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-400/40 touch-manipulation active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 sm:hidden pb-safe-offset"
        aria-label="Open game menu"
      >
        Menu
      </button>
    </>
  );
}