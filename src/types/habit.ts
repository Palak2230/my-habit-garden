export type HabitCategoryId =
  | "skincare"
  | "bodycare"
  | "haircare"
  | "productivity"
  | "health"
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
