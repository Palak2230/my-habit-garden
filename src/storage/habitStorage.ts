import type { Completion } from "../types/completion";
import type { Habit } from "../types/habit";
import type { AppSettings, Category, GardenData, Reflection } from "../types/tracker";

const STORAGE_KEY = "my-habit-garden-data";

const nowIso = () => new Date().toISOString();
const normalize = (value: string) => value.trim().toLowerCase();

const skincareRoutineDefaults = [
  ["☀️", "AM • Facewash"],
  ["☀️", "AM • Toner"],
  ["☀️", "AM • Vitamin C Serum"],
  ["☀️", "AM • Eye Cream"],
  ["☀️", "AM • Moisturizer"],
  ["☀️", "AM • Sunscreen"],
  ["🌙", "PM • Facewash"],
  ["🌙", "PM • Toner"],
  ["🌙", "PM • Serums"],
  ["🌙", "PM • Eye Cream"],
  ["🌙", "PM • Moisturizer"],
] as const;

const haircareDefaults = [
  ["💆", "Hair Care"],
  ["🧴", "Hair Serum"],
  ["🤲", "Hair Massage"],
  ["🧖", "Hair Mask"],
] as const;

const supplementDefaults = [
  ["💊", "Vitamin B12"],
  ["☀️", "Vitamin D"],
  ["⚡", "Creatine"],
  ["🥤", "Protein"],
  ["🌙", "Magnesium"],
  ["🐟", "Omega-3"],
] as const;

const defaultCategories: Category[] = [
  { id: "skincare", name: "Skincare", emoji: "🧴", accent: "#E7BAC5", order: 1 },
  { id: "bodycare", name: "Bodycare", emoji: "🫧", accent: "#BFD6E6", order: 2 },
  { id: "haircare", name: "Hair Care", emoji: "💆", accent: "#E8C7B8", order: 3 },
  { id: "productivity", name: "Productivity", emoji: "📚", accent: "#C8BEDF", order: 4 },
  { id: "health", name: "Health", emoji: "💪", accent: "#B6CFBF", order: 5 },
  { id: "supplements", name: "Supplements", emoji: "💊", accent: "#F3CFBA", order: 6 },
];

const defaultHabits: Habit[] = [
  ...skincareRoutineDefaults.map(([emoji, name]) => [emoji, name, "skincare"] as const),
  ["🚿", "Shower", "bodycare"],
  ["🧴", "Body Lotion", "bodycare"],
  ...haircareDefaults.map(([emoji, name]) => [emoji, name, "haircare"] as const),
  ["💻", "Study / Work", "productivity"],
  ["📖", "Reading", "productivity"],
  ["📝", "Plan Tomorrow", "productivity"],
  ["📵", "Limit Scrolling", "productivity"],
  ["💧", "2L Water", "health"],
  ["🧘", "Exercise / Stretch", "health"],
  ["😴", "Sleep on Time", "health"],
  ...supplementDefaults.map(([emoji, name]) => [emoji, name, "supplements"] as const),
].map(([emoji, name, categoryId], index) => ({
  id: crypto.randomUUID(),
  emoji,
  name,
  categoryId: categoryId as Habit["categoryId"],
  weeklyGoal: 7,
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
      const parsedHabitsRaw = Array.isArray(parsed.habits) ? (parsed.habits as Habit[]) : defaultData.habits;
      const parsedHabits = parsedHabitsRaw.map((habit) => ({
        ...habit,
        weeklyGoal: Math.max(1, Math.min(7, habit.weeklyGoal ?? 7)),
      }));
      const parsedCategories = Array.isArray(parsed.categories) ? (parsed.categories as Category[]) : defaultData.categories;
      const categoryById = new Set(parsedCategories.map((c) => c.id));
      const mergedCategories = [
        ...parsedCategories,
        ...defaultCategories.filter((c) => !categoryById.has(c.id)),
      ].sort((a, b) => a.order - b.order);
      const migratedHabits = parsedHabits.map((habit) => {
        if (habit.categoryId === "health" && habit.name.trim().toLowerCase() === "supplements") {
          return { ...habit, categoryId: "supplements" as Habit["categoryId"] };
        }
        if (
          habit.categoryId === "bodycare" &&
          new Set(["hair care", "hair mask"]).has(normalize(habit.name))
        ) {
          return { ...habit, categoryId: "haircare" as Habit["categoryId"] };
        }
        return habit;
      });
      const legacySkincareNames = new Set([
        "am skincare",
        "pm skincare",
        "sunscreen",
        "treatment",
      ]);
      const skincareMigratedHabits = migratedHabits.map((habit) => {
        if (habit.categoryId === "skincare" && normalize(habit.name) === "am • serums") {
          return { ...habit, name: "AM • Vitamin C Serum" };
        }
        if (habit.categoryId === "skincare" && legacySkincareNames.has(normalize(habit.name))) {
          return { ...habit, active: false };
        }
        return habit;
      });
      // Drop legacy generic "Supplements" row now that supplements have dedicated habits.
      const cleanedHabits = skincareMigratedHabits.filter(
        (habit) => !(habit.categoryId === "supplements" && normalize(habit.name) === "supplements"),
      );
      const existingSkincareNames = new Set(
        cleanedHabits
          .filter((habit) => habit.categoryId === "skincare")
          .map((habit) => normalize(habit.name)),
      );
      const skincareMissingHabits = skincareRoutineDefaults
        .filter(([, name]) => !existingSkincareNames.has(normalize(name)))
        .map(([emoji, name], index) => ({
          id: crypto.randomUUID(),
          emoji,
          name,
          categoryId: "skincare" as Habit["categoryId"],
          weeklyGoal: 7,
          active: true,
          order: index + 1,
          createdAt: nowIso(),
        }));
      const existingHaircareNames = new Set(
        cleanedHabits
          .filter((habit) => habit.categoryId === "haircare")
          .map((habit) => normalize(habit.name)),
      );
      const lastHaircareOrder = cleanedHabits
        .filter((habit) => habit.categoryId === "haircare")
        .reduce((max, habit) => Math.max(max, habit.order), 0);
      const haircareMissingHabits = haircareDefaults
        .filter(([, name]) => !existingHaircareNames.has(normalize(name)))
        .map(([emoji, name], index) => ({
          id: crypto.randomUUID(),
          emoji,
          name,
          categoryId: "haircare" as Habit["categoryId"],
          weeklyGoal: 7,
          active: true,
          order: lastHaircareOrder + index + 1,
          createdAt: nowIso(),
        }));
      const existingSupplementNames = new Set(
        cleanedHabits
          .filter((habit) => habit.categoryId === "supplements")
          .map((habit) => normalize(habit.name)),
      );
      const lastOrder = cleanedHabits.reduce((max, habit) => Math.max(max, habit.order), 0);
      const missingSupplementHabits = supplementDefaults
        .filter(([, name]) => !existingSupplementNames.has(normalize(name)))
        .map(([emoji, name], index) => ({
          id: crypto.randomUUID(),
          emoji,
          name,
          categoryId: "supplements" as Habit["categoryId"],
          weeklyGoal: 7,
          active: true,
          order: lastOrder + index + 1,
          createdAt: nowIso(),
        }));
      return {
        version: 1,
        habits: [...cleanedHabits, ...skincareMissingHabits, ...haircareMissingHabits, ...missingSupplementHabits],
        categories: mergedCategories,
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
