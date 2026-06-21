"use client";

import { useState } from "react";
import type { FilterStep } from "@/lib/types";

interface ComputationalThinkingPanelProps {
  steps: FilterStep[];
}

export function ComputationalThinkingPanel({
  steps,
}: ComputationalThinkingPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className="rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 shadow-md"
      aria-labelledby="thinking-title"
    >
      <button
        type="button"
        id="thinking-title"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full min-h-[52px] items-center justify-between gap-2 p-4 text-left touch-manipulation sm:pointer-events-none sm:cursor-default sm:p-5"
        aria-expanded={expanded}
        aria-controls="thinking-steps"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            🧠
          </span>
          <span className="text-base font-bold text-teal-900 sm:text-lg">
            How We Solved It
          </span>
        </span>
        <span
          className="shrink-0 rounded-full bg-teal-200 px-2.5 py-1 text-xs font-bold text-teal-800 sm:hidden"
          aria-hidden="true"
        >
          {expanded ? "Hide ▲" : "Show ▼"}
        </span>
      </button>

      <div
        id="thinking-steps"
        className={[
          "px-4 pb-4 sm:block sm:px-5 sm:pb-5",
          expanded ? "block" : "hidden sm:block",
        ].join(" ")}
      >
        <p className="mb-4 text-sm text-teal-800">
          Watch how each clue filters the possibilities — just like narrowing
          down answers in a search!
        </p>
        <ol className="space-y-2" role="list">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const isStart = index === 0;
            return (
              <li
                key={`${step.label}-${index}`}
                className={[
                  "flex flex-col gap-1 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 sm:flex-row sm:items-center sm:justify-between sm:text-base",
                  isLast
                    ? "bg-teal-600 font-semibold text-white shadow-md"
                    : "bg-white/80 text-slate-800",
                  isStart && "border border-teal-100",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="min-w-0 break-words pr-0 sm:pr-2">
                  {step.label}:
                </span>
                <span
                  className={[
                    "inline-flex min-w-[3rem] shrink-0 self-start rounded-lg px-2 py-0.5 text-center font-bold sm:self-auto",
                    isLast ? "bg-white/20" : "bg-teal-100 text-teal-800",
                  ].join(" ")}
                >
                  {step.count}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
