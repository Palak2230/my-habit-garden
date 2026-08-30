export type HabitCategoryId = "skincare" | "bodycare" | "productivity" | "health" | "supplements";

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  categoryId: HabitCategoryId;
  active: boolean;
  order: number;
  createdAt: string;
};
