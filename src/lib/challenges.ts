import { ELEMENTS } from "./elements";
import type { Challenge, Clue, Element, FilterStep } from "./types";
import { CATEGORY_LABELS } from "./types";

function categoryClue(category: Element["category"]): Clue {
  return {
    id: `cat-${category}`,
    type: "category",
    label: CATEGORY_LABELS[category],
    text: `Is a ${CATEGORY_LABELS[category].toLowerCase()}`,
    filter: (el) => el.category === category,
  };
}

function atomicLtClue(max: number): Clue {
  return {
    id: `lt-${max}`,
    type: "atomic_lt",
    label: `Atomic Number < ${max}`,
    text: `Has atomic number less than ${max}`,
    filter: (el) => el.atomicNumber < max,
  };
}

function atomicGtClue(min: number): Clue {
  return {
    id: `gt-${min}`,
    type: "atomic_gt",
    label: `Atomic Number > ${min}`,
    text: `Has atomic number greater than ${min}`,
    filter: (el) => el.atomicNumber > min,
  };
}

function atomicBetweenClue(min: number, max: number): Clue {
  return {
    id: `between-${min}-${max}`,
    type: "atomic_between",
    label: `Atomic Number ${min}–${max}`,
    text: `Has atomic number between ${min} and ${max}`,
    filter: (el) => el.atomicNumber >= min && el.atomicNumber <= max,
  };
}

function propertyClue(useTag: string, description: string): Clue {
  return {
    id: `use-${useTag}`,
    type: "use",
    label: description,
    text: description,
    filter: (el) => el.uses.includes(useTag),
  };
}

/** Predefined challenges — each set of clues narrows to exactly one element */
export const CHALLENGES: Challenge[] = [{
  id: "hydrogen-water",
  answer: 1,
  clues: [
    categoryClue("non_metal"),
    atomicLtClue(5),
    propertyClue("water", "Is found in water"),
  ],
},
{
  id: "helium-balloons",
  answer: 2,
  clues: [
    categoryClue("noble_gas"),
    atomicLtClue(10),
    propertyClue("balloons", "Is used in party balloons"),
  ],
},
{
  id: "lithium-batteries",
  answer: 3,
  clues: [
    categoryClue("metal"),
    atomicLtClue(10),
    propertyClue("batteries", "Powers rechargeable batteries"),
  ],
},
{
  id: "carbon-life",
  answer: 6,
  clues: [
    categoryClue("non_metal"),
    atomicLtClue(10),
    propertyClue("life", "Is the basis of life"),
  ],
},
{
  id: "oxygen-breathing",
  answer: 8,
  clues: [
    categoryClue("non_metal"),
    atomicLtClue(15),
    propertyClue("breathing", "Is essential for breathing"),
  ],
},
{
  id: "fluorine-toothpaste",
  answer: 9,
  clues: [
    categoryClue("halogen"),
    atomicLtClue(15),
    propertyClue("toothpaste", "Helps protect teeth in toothpaste"),
  ],
},
{
  id: "neon-signs",
  answer: 10,
  clues: [
    categoryClue("noble_gas"),
    atomicBetweenClue(8, 15),
    propertyClue("signs", "Glows in advertising signs"),
  ],
},
{
  id: "sodium-salt",
  answer: 11,
  clues: [
    categoryClue("metal"),
    atomicLtClue(15),
    propertyClue("salt", "Is a key part of table salt"),
  ],
},
{
  id: "aluminium-cans",
  answer: 13,
  clues: [
    categoryClue("metal"),
    atomicLtClue(20),
    propertyClue("cans", "Is used in soda cans"),
  ],
},
{
  id: "chlorine-pools",
  answer: 17,
  clues: [
    categoryClue("halogen"),
    atomicBetweenClue(10, 20),
    propertyClue("pools", "Keeps swimming pools clean"),
  ],
},
{
  id: "argon-bulbs",
  answer: 18,
  clues: [
    categoryClue("noble_gas"),
    atomicBetweenClue(15, 25),
    propertyClue("light_bulbs", "Is used in light bulbs"),
  ],
},
{
  id: "calcium-bones",
  answer: 20,
  clues: [
    categoryClue("metal"),
    atomicBetweenClue(15, 25),
    propertyClue("bones", "Builds strong bones and teeth"),
  ],
},
{
  id: "iron-blood",
  answer: 26,
  clues: [
    categoryClue("metal"),
    atomicBetweenClue(20, 30),
    propertyClue("blood", "Is important in your blood"),
  ],
},
{
  id: "copper-wiring",
  answer: 29,
  clues: [
    categoryClue("metal"),
    atomicLtClue(40),
    propertyClue("electrical_wiring", "Is used in electrical wiring"),
  ],
},
{
  id: "silver-jewelry",
  answer: 47,
  clues: [
    categoryClue("metal"),
    atomicBetweenClue(40, 55),
    propertyClue("jewelry", "Is used in jewellery"),
  ],
},
{
  id: "iodine-salt",
  answer: 53,
  clues: [
    categoryClue("halogen"),
    atomicGtClue(45),
    propertyClue("salt", "Is added to iodized salt"),
  ],
},
{
  id: "gold-jewelry",
  answer: 79,
  clues: [
    categoryClue("metal"),
    atomicGtClue(70),
    propertyClue("jewelry", "Is used in jewellery"),
    propertyClue("coins", "Is also used in coins"),
  ],
},
];

export function pickRandomChallenge(excludeId?: string): Challenge {
  const pool =
    excludeId && CHALLENGES.length > 1
      ? CHALLENGES.filter((c) => c.id !== excludeId)
      : CHALLENGES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickRandomChallenges(count: number): Challenge[] {
  return [...CHALLENGES]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, CHALLENGES.length));
}

export function computeFilterSteps(challenge: Challenge): FilterStep[] {
  const steps: FilterStep[] = [
    { label: "Starting elements", count: ELEMENTS.length },
  ];

  let remaining = [...ELEMENTS];

  for (const clue of challenge.clues) {
    remaining = remaining.filter(clue.filter);
    steps.push({
      label: `After clue "${clue.text.charAt(0).toUpperCase() + clue.text.slice(1)}"`,
      count: remaining.length,
    });
  }

  return steps;
}

export function validateChallenge(challenge: Challenge): boolean {
  const steps = computeFilterSteps(challenge);
  return steps[steps.length - 1].count === 1;
}
