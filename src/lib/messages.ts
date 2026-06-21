const SUCCESS_MESSAGES = [
  "Awesome discovery!",
  "You're a science superstar!",
  "Boom! Nailed it!",
  "Element expert alert!",
  "That's the one!",
];

const STREAK_MESSAGES: Record<number, string> = {
  2: "Two in a row — nice!",
  3: "Three streak! You're on fire! 🔥",
  5: "Five streak! Unstoppable! ⚡",
  10: "TEN IN A ROW?! Legend! 👑",
};

const WRONG_MESSAGES = [
  "Oops! Not that one — keep looking!",
  "Close try! Read the clues again.",
  "Hmm, that doesn't fit. You can do it!",
  "Wrong element — but don't give up!",
  "Almost there! Check the mission clues.",
];

export function pickSuccessMessage(streak: number): string {
  if (STREAK_MESSAGES[streak]) return STREAK_MESSAGES[streak];
  if (streak > 3) return `${streak} in a row! Keep going! 🔥`;
  return SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
}

export function pickWrongMessage(): string {
  return WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
}
