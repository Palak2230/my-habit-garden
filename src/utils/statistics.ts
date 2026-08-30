import type { Completion } from "../types/completion";
import type { Habit } from "../types/habit";
import type { Category } from "../types/tracker";
import { toDateKey, weekDates } from "./dates";

const completionMap = (completions: Completion[]) =>
  new Map(completions.map((c) => [`${c.habitId}:${c.date}`, c.completed] as const));

export const isCompleted = (map: Map<string, boolean>, habitId: string, dateKey: string) =>
  Boolean(map.get(`${habitId}:${dateKey}`));

export const weeklyCompletionPercent = (
  habits: Habit[],
  completions: Completion[],
  reference: Date,
) => {
  const activeHabits = habits.filter((h) => h.active);
  const days = weekDates(reference).map(toDateKey);
  const expected = activeHabits.length * days.length;
  if (!expected) return 0;
  const map = completionMap(completions);
  let done = 0;
  for (const habit of activeHabits) {
    for (const day of days) {
      if (isCompleted(map, habit.id, day)) done += 1;
    }
  }
  return Math.round((done / expected) * 100);
};

export const dailyCompletionSeries = (
  habits: Habit[],
  completions: Completion[],
  reference: Date,
) => {
  const activeHabits = habits.filter((h) => h.active);
  const map = completionMap(completions);
  return weekDates(reference).map((date) => {
    const key = toDateKey(date);
    const done = activeHabits.filter((habit) => isCompleted(map, habit.id, key)).length;
    const value = activeHabits.length ? Math.round((done / activeHabits.length) * 100) : 0;
    return {
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      value,
      dateKey: key,
    };
  });
};

export const categoryCompletion = (
  categories: Category[],
  habits: Habit[],
  completions: Completion[],
  reference: Date,
) => {
  const map = completionMap(completions);
  const days = weekDates(reference).map(toDateKey);
  return categories.map((category) => {
    const catHabits = habits.filter((h) => h.active && h.categoryId === category.id);
    const expected = catHabits.length * days.length;
    let done = 0;
    for (const habit of catHabits) {
      for (const day of days) {
        if (isCompleted(map, habit.id, day)) done += 1;
      }
    }
    return { categoryId: category.id, value: expected ? Math.round((done / expected) * 100) : 0 };
  });
};
