import type { Completion } from "../types/completion";
import type { Habit } from "../types/habit";
import type { AppSettings, Category, GardenData, Reflection } from "../types/tracker";

const STORAGE_KEY = "my-habit-garden-data";

const nowIso = () => new Date().toISOString();

const defaultCategories: Category[] = [
  { id: "skincare", name: "Skincare", emoji: "🧴", accent: "#E7BAC5", order: 1 },
  { id: "bodycare", name: "Bodycare", emoji: "🫧", accent: "#BFD6E6", order: 2 },
  { id: "productivity", name: "Productivity", emoji: "📚", accent: "#C8BEDF", order: 3 },
  { id: "health", name: "Health", emoji: "💪", accent: "#B6CFBF", order: 4 },
];

const defaultHabits: Habit[] = [
  ["☀️", "AM Skincare", "skincare"],
  ["🌙", "PM Skincare", "skincare"],
  ["🧴", "Sunscreen", "skincare"],
  ["✨", "Treatment", "skincare"],
  ["🚿", "Shower", "bodycare"],
  ["🧴", "Body Lotion", "bodycare"],
  ["💆", "Hair Care", "bodycare"],
  ["🧖", "Hair Mask", "bodycare"],
  ["💻", "Study / Work", "productivity"],
  ["📖", "Reading", "productivity"],
  ["📝", "Plan Tomorrow", "productivity"],
  ["📵", "Limit Scrolling", "productivity"],
  ["💧", "2L Water", "health"],
  ["🧘", "Exercise / Stretch", "health"],
  ["😴", "Sleep on Time", "health"],
  ["💊", "Supplements", "health"],
].map(([emoji, name, categoryId], index) => ({
  id: crypto.randomUUID(),
  emoji,
  name,
  categoryId: categoryId as Habit["categoryId"],
  active: true,
  order: index + 1,
  createdAt: nowIso(),
}));

const defaultSettings: AppSettings = {
  theme: "light",
  accent: "rose",
  displayName: "",
};

const defaultData: GardenData = {
  version: 1,
  habits: defaultHabits,
  categories: defaultCategories,
  completions: [],
  reflections: [],
  settings: defaultSettings,
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const habitStorage = {
  key: STORAGE_KEY,

  load(): GardenData {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.save(defaultData);
      return defaultData;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!isObject(parsed)) return defaultData;
      return {
        version: 1,
        habits: Array.isArray(parsed.habits) ? (parsed.habits as Habit[]) : defaultData.habits,
        categories: Array.isArray(parsed.categories) ? (parsed.categories as Category[]) : defaultData.categories,
        completions: Array.isArray(parsed.completions) ? (parsed.completions as Completion[]) : [],
        reflections: Array.isArray(parsed.reflections) ? (parsed.reflections as Reflection[]) : [],
        settings: isObject(parsed.settings) ? { ...defaultSettings, ...parsed.settings } as AppSettings : defaultSettings,
      };
    } catch {
      return defaultData;
    }
  },

  save(data: GardenData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  reset() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  },
};
