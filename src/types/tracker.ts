import type { Completion } from "./completion";
import type { Habit, HabitCategoryId } from "./habit";

export type Category = {
  id: HabitCategoryId;
  name: string;
  emoji: string;
  accent: string;
  order: number;
};

export type Reflection = {
  weekStart: string;
  wentWell: string;
  improve: string;
  proud: string;
};

export type AppSettings = {
  theme: "light" | "dark" | "system";
  accent: "rose" | "lavender" | "sage" | "blue" | "peach";
  displayName: string;
};

export type GardenData = {
  version: 1;
  habits: Habit[];
  categories: Category[];
  completions: Completion[];
  reflections: Reflection[];
  settings: AppSettings;
};
