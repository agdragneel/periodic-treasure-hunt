"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ELEMENTS } from "@/lib/elements";
import type { Element } from "@/lib/types";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/types";

/** 18 columns × 44px tiles + gaps — ensures touch-friendly targets when scrolling */
const TABLE_MIN_WIDTH = 18 * 44 + 17 * 4;

interface ElementTileProps {
  element: Element;
  onSelect: (atomicNumber: number) => void;
  disabled?: boolean;
  selected?: boolean;
}

export function ElementTile({
  element,
  onSelect,
  disabled = false,
  selected = false,
}: ElementTileProps) {
  const colors = CATEGORY_COLORS[element.category];

  return (
    <button
      type="button"
      onClick={() => onSelect(element.atomicNumber)}
      disabled={disabled}
      aria-label={`${element.name}, atomic number ${element.atomicNumber}, ${CATEGORY_LABELS[element.category]}`}
      className={[
        "group relative flex aspect-square min-h-[44px] min-w-[44px] flex-col items-center justify-center rounded-lg border-2 px-0.5 py-1 text-center shadow-sm transition-all duration-200 sm:rounded-xl",
        "touch-manipulation select-none",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-1",
        "active:scale-95 disabled:cursor-not-allowed",
        colors.bg,
        colors.border,
        colors.text,
        !disabled && colors.hover,
        selected && "animate-selected-pop border-orange-400 bg-orange-100 text-blue-950 shadow-lg shadow-orange-200 ring-4 ring-blue-300/70",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="text-[9px] font-semibold leading-none opacity-70 sm:text-[10px]">
        {element.atomicNumber}
      </span>
      <span className="text-sm font-bold leading-tight sm:text-base md:text-lg">
        {element.symbol}
      </span>
    </button>
  );
}

interface PeriodicTableProps {
  onSelect: (atomicNumber: number) => void;
  disabled?: boolean;
  selectedElement?: number | null;
}

function buildGridCells(): (Element | null)[][] {
  const rows: (Element | null)[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 18 }, () => null)
  );

  for (const el of ELEMENTS) {
    if (el.series === "lanthanide" && el.atomicNumber !== 57) {
      rows[7][el.atomicNumber - 57 + 2] = el;
      continue;
    }
    if (el.series === "actinide" && el.atomicNumber !== 89) {
      rows[8][el.atomicNumber - 89 + 2] = el;
      continue;
    }
    rows[el.period - 1][el.group - 1] = el;
  }

  return rows;
}

const GRID = buildGridCells();

export function PeriodicTable({
  onSelect,
  disabled = false,
  selectedElement = null,
}: PeriodicTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showHint, setShowHint] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);

    if (scrollLeft > 8) {
      setShowHint(false);
    }
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const hintTimer = window.setTimeout(() => setShowHint(false), 6000);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      window.clearTimeout(hintTimer);
    };
  }, [updateScrollState]);

  return (
    <section aria-label="Periodic table of elements">
      {showHint && canScrollRight && (
        <p className="mb-2 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-indigo-600 sm:hidden">
          <span aria-hidden="true">👆</span>
          Swipe left &amp; right to explore the table
          <span className="animate-pulse" aria-hidden="true">
            →
          </span>
        </p>
      )}

      <div className="relative -mx-1 sm:mx-0">
        {canScrollLeft && (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-slate-100/90 to-transparent sm:w-8"
            aria-hidden="true"
          />
        )}
        {canScrollRight && (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-cyan-50/90 to-transparent sm:w-8"
            aria-hidden="true"
          />
        )}

        <div
          ref={scrollRef}
          className="table-scroll overflow-x-auto overscroll-x-contain pb-3 pt-1"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div
            className="mx-auto max-w-5xl px-1"
            style={{ minWidth: TABLE_MIN_WIDTH }}
            role="grid"
          >
            {GRID.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="mb-1 grid grid-cols-18 gap-1"
                role="row"
              >
                {row.map((cell, colIndex) => {
                  if (!cell) {
                    if (rowIndex === 7 && colIndex === 1) {
                      return (
                        <div
                          key={`label-ln-${colIndex}`}
                          className="flex min-h-[44px] items-center justify-center rounded-lg bg-slate-100 px-0.5 text-[8px] font-bold leading-tight text-slate-600 sm:text-[10px]"
                          aria-hidden="true"
                        >
                          57–71
                        </div>
                      );
                    }
                    if (rowIndex === 8 && colIndex === 1) {
                      return (
                        <div
                          key={`label-an-${colIndex}`}
                          className="flex min-h-[44px] items-center justify-center rounded-lg bg-slate-100 px-0.5 text-[8px] font-bold leading-tight text-slate-600 sm:text-[10px]"
                          aria-hidden="true"
                        >
                          89–103
                        </div>
                      );
                    }
                    return (
                      <div
                        key={`empty-${rowIndex}-${colIndex}`}
                        className="min-h-[44px] min-w-[44px]"
                        aria-hidden="true"
                      />
                    );
                  }

                  return (
                    <ElementTile
                      key={cell.atomicNumber}
                      element={cell}
                      onSelect={onSelect}
                      disabled={disabled}
                      selected={selectedElement === cell.atomicNumber}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
        {(Object.entries(CATEGORY_LABELS) as [Element["category"], string][]).map(
          ([category, label]) => {
            const colors = CATEGORY_COLORS[category];
            return (
              <div key={category} className="flex items-center gap-1.5">
                <span
                  className={`h-3.5 w-3.5 shrink-0 rounded border-2 sm:h-4 sm:w-4 sm:rounded-md ${colors.bg} ${colors.border}`}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-medium text-slate-700 sm:text-xs md:text-sm">
                  {label}
                </span>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}
