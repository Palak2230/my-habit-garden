import { createContext, createElement, useContext, useMemo, useState } from "react";
import { habitStorage } from "../storage/habitStorage";
import type { Completion } from "../types/completion";
import type { Habit, HabitCategoryId } from "../types/habit";
import type { AppSettings, Category, GardenData, Reflection } from "../types/tracker";
import { toDateKey } from "../utils/dates";
import { currentStreak, longestStreak } from "../utils/streaks";
import { categoryCompletion, dailyCompletionSeries, weeklyCompletionPercent } from "../utils/statistics";

type AddHabitInput = {
  name: string;
  emoji: string;
  categoryId: HabitCategoryId;
  weeklyGoal: number;
};

type GardenContextValue = {
  data: GardenData;
  habitsByCategory: Category[];
  toggleCompletion: (habitId: string, date: Date) => void;
  isCompleted: (habitId: string, date: Date) => boolean;
  addHabit: (input: AddHabitInput) => void;
  updateHabit: (habit: Habit) => void;
  deactivateHabit: (habitId: string) => void;
  reorderHabit: (habitId: string, direction: "up" | "down") => void;
  updateReflection: (reflection: Reflection) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  exportData: () => void;
  importData: (raw: string) => { ok: boolean; message: string };
  resetAll: () => void;
  statsForWeek: (reference: Date) => {
    weeklyPercent: number;
    streak: number;
    longest: number;
    bestHabit: Habit | null;
    category: { categoryId: string; value: number }[];
    dailySeries: { label: string; value: number; dateKey: string }[];
  };
};

const GardenContext = createContext<GardenContextValue | null>(null);

const reorderWithinCategory = (habits: Habit[]) =>
  habits
    .map((h, index) => ({ ...h, order: index + 1 }))
    .sort((a, b) => a.order - b.order);

export const GardenProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<GardenData>(() => habitStorage.load());

  const persist = (next: GardenData) => {
    setData(next);
    habitStorage.save(next);
  };

  const toggleCompletion = (habitId: string, date: Date) => {
    const dateKey = toDateKey(date);
    const key = `${habitId}:${dateKey}`;
    const map = new Map(data.completions.map((c) => [`${c.habitId}:${c.date}`, c]));
    const existing = map.get(key);
    const updated: Completion = {
      habitId,
      date: dateKey,
      completed: !existing?.completed,
    };
    map.set(key, updated);
    persist({ ...data, completions: Array.from(map.values()) });
  };

  const isCompleted = (habitId: string, date: Date) => {
    const dateKey = toDateKey(date);
    return data.completions.some((c) => c.habitId === habitId && c.date === dateKey && c.completed);
  };

  const addHabit = ({ name, emoji, categoryId, weeklyGoal }: AddHabitInput) => {
    const categoryHabits = data.habits.filter((h) => h.categoryId === categoryId);
    const next: Habit = {
      id: crypto.randomUUID(),
      name,
      emoji,
      categoryId,
      weeklyGoal: Math.max(1, Math.min(7, weeklyGoal)),
      active: true,
      order: categoryHabits.length + 1,
      createdAt: new Date().toISOString(),
    };
    persist({ ...data, habits: [...data.habits, next] });
  };

  const updateHabit = (habit: Habit) => {
    persist({ ...data, habits: data.habits.map((h) => (h.id === habit.id ? habit : h)) });
  };

  const deactivateHabit = (habitId: string) => {
    persist({
      ...data,
      habits: data.habits.map((h) => (h.id === habitId ? { ...h, active: false } : h)),
    });
  };

  const reorderHabit = (habitId: string, direction: "up" | "down") => {
    const target = data.habits.find((h) => h.id === habitId);
    if (!target) return;
    const categoryHabits = data.habits
      .filter((h) => h.categoryId === target.categoryId)
      .sort((a, b) => a.order - b.order);
    const index = categoryHabits.findIndex((h) => h.id === habitId);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= categoryHabits.length) return;
    const clone = [...categoryHabits];
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
    const reordered = reorderWithinCategory(clone);
    const merged = data.habits.map((h) => reordered.find((x) => x.id === h.id) ?? h);
    persist({ ...data, habits: merged });
  };

  const updateReflection = (reflection: Reflection) => {
    const next = [...data.reflections];
    const index = next.findIndex((r) => r.weekStart === reflection.weekStart);
    if (index >= 0) next[index] = reflection;
    else next.push(reflection);
    persist({ ...data, reflections: next });
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    persist({ ...data, settings: { ...data.settings, ...settings } });
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-habit-garden-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (raw: string) => {
    try {
      const parsed = JSON.parse(raw) as GardenData;
      if (!Array.isArray(parsed.habits) || !Array.isArray(parsed.categories) || !Array.isArray(parsed.completions)) {
        return { ok: false, message: "Invalid backup format." };
      }
      persist(parsed);
      return { ok: true, message: "Backup imported." };
    } catch {
      return { ok: false, message: "Could not parse JSON." };
    }
  };

  const resetAll = () => persist(habitStorage.reset());

  const habitsByCategory = useMemo(
    () => [...data.categories].sort((a, b) => a.order - b.order),
    [data.categories],
  );

  const statsForWeek = (reference: Date) => {
    const activeHabits = data.habits.filter((h) => h.active);
    const weeklyPercent = weeklyCompletionPercent(activeHabits, data.completions, reference);
    const streak = currentStreak(activeHabits, data.completions);
    const longest = longestStreak(activeHabits, data.completions);
    const dailySeries = dailyCompletionSeries(activeHabits, data.completions, reference);
    const category = categoryCompletion(data.categories, activeHabits, data.completions, reference);
    const bestHabit = activeHabits
      .map((habit) => {
        const done = data.completions.filter((c) => c.habitId === habit.id && c.completed).length;
        return { habit, done };
      })
      .sort((a, b) => b.done - a.done)[0]?.habit ?? null;
    return { weeklyPercent, streak, longest, bestHabit, category, dailySeries };
  };

  return createElement(
    GardenContext.Provider,
    {
      value: {
        data,
        habitsByCategory,
        toggleCompletion,
        isCompleted,
        addHabit,
        updateHabit,
        deactivateHabit,
        reorderHabit,
        updateReflection,
        updateSettings,
        exportData,
        importData,
        resetAll,
        statsForWeek,
      },
    },
    children,
  );
};

export const useHabits = () => {
  const context = useContext(GardenContext);
  if (!context) throw new Error("useHabits must be used inside GardenProvider");
  return context;
};
