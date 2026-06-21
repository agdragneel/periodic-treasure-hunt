"use client";

import { useEffect, useState } from "react";

const SAD_EMOJIS = ["😢", "😔", "😞", "😿", "💧", "🥺"];

interface Floater {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

interface FloatingEmojisProps {
  active: boolean;
}

export function FloatingEmojis({ active }: FloatingEmojisProps) {
  const [floaters, setFloaters] = useState<Floater[]>([]);

  useEffect(() => {
    if (!active) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const batch: Floater[] = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      emoji: SAD_EMOJIS[Math.floor(Math.random() * SAD_EMOJIS.length)],
      left: 5 + Math.random() * 90,
      delay: Math.random() * 0.4,
      duration: 2 + Math.random() * 1.5,
      size: 1.5 + Math.random() * 1.5,
    }));

    setFloaters(batch);

    const timer = window.setTimeout(() => setFloaters([]), 3500);
    return () => window.clearTimeout(timer);
  }, [active]);

  if (floaters.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden="true"
    >
      {floaters.map((f) => (
        <span
          key={f.id}
          className="animate-float-emoji absolute bottom-0 select-none"
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}rem`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
          }}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}
