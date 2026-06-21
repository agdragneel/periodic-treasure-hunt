import { STORAGE_KEY, type GameStats } from "./types";

export const DEFAULT_STATS: GameStats = {
  score: 0,
  correctAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export function loadStats(): GameStats {
  if (typeof window === "undefined") return DEFAULT_STATS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw) as Partial<GameStats>;
    return {
      score: parsed.score ?? 0,
      correctAnswers: parsed.correctAnswers ?? 0,
      currentStreak: parsed.currentStreak ?? 0,
      bestStreak: parsed.bestStreak ?? 0,
    };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: GameStats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}
