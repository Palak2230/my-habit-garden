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

export type DayStatusType = "rest" | "sick" | "away";

export type DayStatus = {
  date: string;
  type: DayStatusType;
  note?: string;
};

export type TrackerType = "mood" | "skin" | "water" | "productivity";

export type TrackerEntry = {
  date: string;
  mood?: number;
  skin?: number;
  water?: number;
  productivity?: number;
  note?: string;
};

export type HabitReminder = {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
  categoryId?: HabitCategoryId;
  habitId?: string;
};

export type AppSettings = {
  theme: "light" | "dark" | "system";
  accent: "rose" | "lavender" | "sage" | "blue" | "peach";
  displayName: string;
  sectionPassThreshold: number;
  sectionPassThresholds: Record<string, number>;
  enabledTrackers: TrackerType[];
  notificationsEnabled: boolean;
};

export type GardenData = {
  version: 1;
  habits: Habit[];
  categories: Category[];
  completions: Completion[];
  reflections: Reflection[];
  dayStatuses: DayStatus[];
  trackerEntries: TrackerEntry[];
  reminders: HabitReminder[];
  settings: AppSettings;
};

export const TRACKER_META: Record<
  TrackerType,
  { label: string; emoji: string; description: string }
> = {
  mood: { label: "Mood", emoji: "😊", description: "How you feel today" },
  skin: { label: "Skin Health", emoji: "✨", description: "How your skin feels" },
  water: { label: "Water", emoji: "💧", description: "Glasses of water today" },
  productivity: { label: "Productivity", emoji: "📚", description: "How focused you were" },
};

export const ALL_TRACKERS: TrackerType[] = ["mood", "skin", "water", "productivity"];
