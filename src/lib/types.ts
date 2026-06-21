export type ElementCategory =
  | "metal"
  | "non_metal"
  | "metalloid"
  | "noble_gas"
  | "halogen";

export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  category: ElementCategory;
  period: number;
  group: number;
  /** Standard table placement; lanthanides/actinides use group 3 with row offset */
  series?: "lanthanide" | "actinide";
  uses: string[];
  funFact: string;
}

export type ClueType =
  | "category"
  | "atomic_lt"
  | "atomic_gt"
  | "atomic_between"
  | "use";

export interface Clue {
  id: string;
  type: ClueType;
  label: string;
  /** Human-readable text shown on the mission card */
  text: string;
  /** Filter predicate */
  filter: (element: Element) => boolean;
}

export interface Challenge {
  id: string;
  answer: number;
  clues: Clue[];
}

export interface GameStats {
  score: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
}

export interface FilterStep {
  label: string;
  count: number;
}

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  metal: "Metal",
  non_metal: "Non-metal",
  metalloid: "Metalloid",
  noble_gas: "Noble Gas",
  halogen: "Halogen",
};

export const CATEGORY_COLORS: Record<
  ElementCategory,
  { bg: string; border: string; text: string; hover: string }
> = {
  metal: {
    bg: "bg-sky-100",
    border: "border-sky-300",
    text: "text-sky-900",
    hover: "hover:bg-sky-200",
  },
  non_metal: {
    bg: "bg-emerald-100",
    border: "border-emerald-300",
    text: "text-emerald-900",
    hover: "hover:bg-emerald-200",
  },
  metalloid: {
    bg: "bg-amber-100",
    border: "border-amber-300",
    text: "text-amber-900",
    hover: "hover:bg-amber-200",
  },
  noble_gas: {
    bg: "bg-violet-100",
    border: "border-violet-300",
    text: "text-violet-900",
    hover: "hover:bg-violet-200",
  },
  halogen: {
    bg: "bg-rose-100",
    border: "border-rose-300",
    text: "text-rose-900",
    hover: "hover:bg-rose-200",
  },
};

export const STORAGE_KEY = "pt-treasure-hunt-stats";
