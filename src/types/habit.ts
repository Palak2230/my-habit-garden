export type HabitCategoryId =
  | "skincare"
  | "beforesleep"
  | "bodycare"
  | "haircare"
  | "productivity"
  | "health"
  | "fitness"
  | "supplements";

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  categoryId: HabitCategoryId;
  weeklyGoal: number;
  active: boolean;
  order: number;
  createdAt: string;
};
