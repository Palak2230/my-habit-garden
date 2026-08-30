import type { Completion } from "../types/completion";
import type { Habit } from "../types/habit";
import { addDays, parseDateKey, toDateKey } from "./dates";

export const currentStreak = (habits: Habit[], completions: Completion[]) => {
  const activeIds = new Set(habits.filter((h) => h.active).map((h) => h.id));
  if (!activeIds.size) return 0;

  const completionDays = new Set(
    completions
      .filter((c) => c.completed && activeIds.has(c.habitId))
      .map((c) => c.date),
  );

  let streak = 0;
  let cursor = new Date();
  while (completionDays.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
};

export const longestStreak = (habits: Habit[], completions: Completion[]) => {
  const activeIds = new Set(habits.filter((h) => h.active).map((h) => h.id));
  const dayKeys = Array.from(
    new Set(
      completions
        .filter((c) => c.completed && activeIds.has(c.habitId))
        .map((c) => c.date),
    ),
  ).sort();

  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const key of dayKeys) {
    if (!prev) {
      run = 1;
    } else {
      const expected = toDateKey(addDays(parseDateKey(prev), 1));
      run = expected === key ? run + 1 : 1;
    }
    prev = key;
    best = Math.max(best, run);
  }
  return best;
};
