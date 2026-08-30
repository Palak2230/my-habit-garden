import type { Completion } from "../types/completion";
import type { Habit } from "../types/habit";
import type { AppSettings, Category, GardenData, Reflection } from "../types/tracker";

const STORAGE_KEY = "my-habit-garden-data";

const nowIso = () => new Date().toISOString();
const normalize = (value: string) => value.trim().toLowerCase();

const skincareRoutineDefaults = [
  ["☀️", "AM • Cetaphil Facewash"],
  ["☀️", "AM • Toner"],
  ["☀️", "AM • Vitamin C Serum"],
  ["☀️", "AM • Sunscreen"],
  ["🌙", "PM • Minimalist Facewash"],
  ["🌙", "PM • Niacinamide Serum"],
  ["🌙", "PM • Azelaic Acid"],
  ["🌙", "PM • Moisturizer"],
] as const;

const beforeSleepDefaults = [
  ["🌌", "Read Book"],
  ["🌌", "Put Phone Away in Last 30 Minutes"],
  ["🌌", "Use Facial Rollers"],
  ["🌌", "Put Body Lotion"],
] as const;

const bodycareDefaults = [
  ["🚿", "Shower"],
  ["🧴", "Body Lotion"],
  ["🦶", "Foot Cream"],
  ["✨", "Roll On"],
] as const;

const haircareDefaults = [
  ["🧴", "WishCare Serum"],
  ["🤲", "Massage"],
  ["🫧", "Hair Wash"],
  ["🪔", "Hair Oiling"],
] as const;

const healthDefaults = [
  ["💧", ">2L Water Intake"],
  ["🌙", "Sleep till 12:30 AM"],
] as const;

const fitnessDefaults = [
  ["🚶", "Walk 5000 Steps a Day"],
  ["🏋️", "Exercise"],
  ["🧘", "Yoga"],
  ["🙂", "Face Exercises"],
  ["🪑", "Back Posture Exercises"],
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
  { id: "beforesleep", name: "Before Sleep Routine", emoji: "🌌", accent: "#D4CAE6", order: 2 },
  { id: "bodycare", name: "Bodycare", emoji: "🫧", accent: "#BFD6E6", order: 3 },
  { id: "haircare", name: "Hair Care", emoji: "💆", accent: "#E8C7B8", order: 4 },
  { id: "productivity", name: "Productivity", emoji: "📚", accent: "#C8BEDF", order: 5 },
  { id: "health", name: "Health", emoji: "💪", accent: "#B6CFBF", order: 6 },
  { id: "fitness", name: "Fitness", emoji: "🏃", accent: "#BEE1D8", order: 7 },
  { id: "supplements", name: "Supplements", emoji: "💊", accent: "#F3CFBA", order: 8 },
];

const defaultHabits: Habit[] = [
  ...skincareRoutineDefaults.map(([emoji, name]) => [emoji, name, "skincare"] as const),
  ...beforeSleepDefaults.map(([emoji, name]) => [emoji, name, "beforesleep"] as const),
  ...bodycareDefaults.map(([emoji, name]) => [emoji, name, "bodycare"] as const),
  ...haircareDefaults.map(([emoji, name]) => [emoji, name, "haircare"] as const),
  ["💻", "Study / Work", "productivity"],
  ["📖", "Reading", "productivity"],
  ["📝", "Plan Tomorrow", "productivity"],
  ["📵", "Limit Scrolling", "productivity"],
  ...healthDefaults.map(([emoji, name]) => [emoji, name, "health"] as const),
  ...fitnessDefaults.map(([emoji, name]) => [emoji, name, "fitness"] as const),
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
        if (habit.categoryId === "skincare" && normalize(habit.name).startsWith("before sleep •")) {
          return { ...habit, categoryId: "beforesleep" as Habit["categoryId"] };
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
        if (habit.categoryId === "skincare" && normalize(habit.name) === "am • facewash") {
          return { ...habit, name: "AM • Cetaphil Facewash" };
        }
        if (habit.categoryId === "skincare" && normalize(habit.name) === "am • serums") {
          return { ...habit, name: "AM • Vitamin C Serum" };
        }
        if (habit.categoryId === "skincare" && normalize(habit.name) === "pm • facewash") {
          return { ...habit, name: "PM • Minimalist Facewash" };
        }
        if (habit.categoryId === "skincare" && normalize(habit.name) === "pm • serums") {
          return { ...habit, name: "PM • Niacinamide Serum" };
        }
        if (
          habit.categoryId === "skincare" &&
          new Set([
            "am • eye cream",
            "am • moisturizer",
            "pm • toner",
            "pm • eye cream",
          ]).has(normalize(habit.name))
        ) {
          return { ...habit, active: false };
        }
        if (habit.categoryId === "skincare" && normalize(habit.name) === "pm • moisturizer") {
          return { ...habit, active: true };
        }
        if (habit.categoryId === "skincare" && normalize(habit.name) === "am • toner") {
          return { ...habit, active: true };
        }
        if (habit.categoryId === "skincare" && legacySkincareNames.has(normalize(habit.name))) {
          return { ...habit, active: false };
        }
        return habit;
      });
      const routineAdjustedHabits = skincareMigratedHabits.map((habit) => {
        if (
          habit.categoryId === "beforesleep" &&
          normalize(habit.name).startsWith("before sleep •")
        ) {
          return { ...habit, name: habit.name.replace(/^Before Sleep •\s*/i, "").trim() };
        }
        if (habit.categoryId === "haircare" && normalize(habit.name) === "hair serum") {
          return { ...habit, name: "WishCare Serum" };
        }
        if (habit.categoryId === "haircare" && normalize(habit.name) === "hair massage") {
          return { ...habit, name: "Massage" };
        }
        if (habit.categoryId === "haircare" && normalize(habit.name) === "hair care") {
          return { ...habit, active: false };
        }
        if (habit.categoryId === "haircare" && normalize(habit.name) === "hair mask") {
          return { ...habit, active: false };
        }
        if (habit.categoryId === "health" && normalize(habit.name) === "2l water") {
          return { ...habit, name: ">2L Water Intake" };
        }
        if (habit.categoryId === "health" && normalize(habit.name) === "sleep on time") {
          return { ...habit, name: "Sleep till 12:30 AM" };
        }
        if (habit.categoryId === "health" && normalize(habit.name) === "exercise / stretch") {
          return { ...habit, categoryId: "fitness" as Habit["categoryId"], name: "Exercise" };
        }
        return habit;
      });
      // Drop legacy generic "Supplements" row now that supplements have dedicated habits.
      const cleanedHabits = routineAdjustedHabits.filter(
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
      const existingBeforeSleepNames = new Set(
        cleanedHabits
          .filter((habit) => habit.categoryId === "beforesleep")
          .map((habit) => normalize(habit.name)),
      );
      const lastBeforeSleepOrder = cleanedHabits
        .filter((habit) => habit.categoryId === "beforesleep")
        .reduce((max, habit) => Math.max(max, habit.order), 0);
      const beforeSleepMissingHabits = beforeSleepDefaults
        .filter(([, name]) => !existingBeforeSleepNames.has(normalize(name)))
        .map(([emoji, name], index) => ({
          id: crypto.randomUUID(),
          emoji,
          name,
          categoryId: "beforesleep" as Habit["categoryId"],
          weeklyGoal: 7,
          active: true,
          order: lastBeforeSleepOrder + index + 1,
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
      const existingBodycareNames = new Set(
        cleanedHabits
          .filter((habit) => habit.categoryId === "bodycare")
          .map((habit) => normalize(habit.name)),
      );
      const lastBodycareOrder = cleanedHabits
        .filter((habit) => habit.categoryId === "bodycare")
        .reduce((max, habit) => Math.max(max, habit.order), 0);
      const bodycareMissingHabits = bodycareDefaults
        .filter(([, name]) => !existingBodycareNames.has(normalize(name)))
        .map(([emoji, name], index) => ({
          id: crypto.randomUUID(),
          emoji,
          name,
          categoryId: "bodycare" as Habit["categoryId"],
          weeklyGoal: 7,
          active: true,
          order: lastBodycareOrder + index + 1,
          createdAt: nowIso(),
        }));
      const existingHealthNames = new Set(
        cleanedHabits
          .filter((habit) => habit.categoryId === "health")
          .map((habit) => normalize(habit.name)),
      );
      const lastHealthOrder = cleanedHabits
        .filter((habit) => habit.categoryId === "health")
        .reduce((max, habit) => Math.max(max, habit.order), 0);
      const healthMissingHabits = healthDefaults
        .filter(([, name]) => !existingHealthNames.has(normalize(name)))
        .map(([emoji, name], index) => ({
          id: crypto.randomUUID(),
          emoji,
          name,
          categoryId: "health" as Habit["categoryId"],
          weeklyGoal: 7,
          active: true,
          order: lastHealthOrder + index + 1,
          createdAt: nowIso(),
        }));
      const existingFitnessNames = new Set(
        cleanedHabits
          .filter((habit) => habit.categoryId === "fitness")
          .map((habit) => normalize(habit.name)),
      );
      const lastFitnessOrder = cleanedHabits
        .filter((habit) => habit.categoryId === "fitness")
        .reduce((max, habit) => Math.max(max, habit.order), 0);
      const fitnessMissingHabits = fitnessDefaults
        .filter(([, name]) => !existingFitnessNames.has(normalize(name)))
        .map(([emoji, name], index) => ({
          id: crypto.randomUUID(),
          emoji,
          name,
          categoryId: "fitness" as Habit["categoryId"],
          weeklyGoal: 7,
          active: true,
          order: lastFitnessOrder + index + 1,
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
        habits: [
          ...cleanedHabits,
          ...skincareMissingHabits,
          ...beforeSleepMissingHabits,
          ...bodycareMissingHabits,
          ...haircareMissingHabits,
          ...healthMissingHabits,
          ...fitnessMissingHabits,
          ...missingSupplementHabits,
        ],
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
