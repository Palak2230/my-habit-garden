import type { Habit } from "../../types/habit";
import { HabitRow } from "./HabitRow";

type Props = {
  categoryId: string;
  title: string;
  emoji: string;
  accent: string;
  habits: Habit[];
  dayKeys: string[];
  dateLookup: Record<string, Date>;
  onWeeklyGoalChange: (habitId: string, weeklyGoal: number) => void;
  completed: (habitId: string, dateKey: string) => boolean;
  onToggle: (habitId: string, date: Date) => void;
};

export const CategorySection = ({
  categoryId,
  title,
  emoji,
  accent,
  habits,
  dayKeys,
  dateLookup,
  onWeeklyGoalChange,
  completed,
  onToggle,
}: Props) => (
  <section className="mb-4 rounded-xl border border-stone-100 bg-white/80 p-3">
    <div className="mb-2 rounded-lg px-3 py-2 font-semibold" style={{ backgroundColor: `${accent}55` }}>
      {emoji} {title.toUpperCase()}
    </div>
    {categoryId === "skincare" ? (
      <>
        <RoutineBlock
          label="☀️ AM Routine"
          habits={habits.filter((habit) => habit.name.startsWith("AM •"))}
          dayKeys={dayKeys}
          dateLookup={dateLookup}
          onWeeklyGoalChange={onWeeklyGoalChange}
          completed={completed}
          onToggle={onToggle}
        />
        <RoutineBlock
          label="🌙 PM Routine"
          habits={habits.filter((habit) => habit.name.startsWith("PM •"))}
          dayKeys={dayKeys}
          dateLookup={dateLookup}
          onWeeklyGoalChange={onWeeklyGoalChange}
          completed={completed}
          onToggle={onToggle}
        />
        <RoutineBlock
          label="✨ Other"
          habits={habits.filter((habit) => !habit.name.startsWith("AM •") && !habit.name.startsWith("PM •"))}
          dayKeys={dayKeys}
          dateLookup={dateLookup}
          onWeeklyGoalChange={onWeeklyGoalChange}
          completed={completed}
          onToggle={onToggle}
        />
      </>
    ) : (
      habits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          dayKeys={dayKeys}
          dateLookup={dateLookup}
          weeklyDone={dayKeys.filter((dayKey) => completed(habit.id, dayKey)).length}
          onWeeklyGoalChange={onWeeklyGoalChange}
          completed={completed}
          onToggle={onToggle}
        />
      ))
    )}
  </section>
);

const RoutineBlock = ({
  label,
  habits,
  dayKeys,
  dateLookup,
  onWeeklyGoalChange,
  completed,
  onToggle,
}: {
  label: string;
  habits: Habit[];
  dayKeys: string[];
  dateLookup: Record<string, Date>;
  onWeeklyGoalChange: (habitId: string, weeklyGoal: number) => void;
  completed: (habitId: string, dateKey: string) => boolean;
  onToggle: (habitId: string, date: Date) => void;
}) => {
  if (!habits.length) return null;
  return (
    <div className="mb-3">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</div>
      {habits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          dayKeys={dayKeys}
          dateLookup={dateLookup}
          weeklyDone={dayKeys.filter((dayKey) => completed(habit.id, dayKey)).length}
          onWeeklyGoalChange={onWeeklyGoalChange}
          completed={completed}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};
