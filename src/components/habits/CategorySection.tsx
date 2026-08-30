import type { Habit } from "../../types/habit";
import { HabitRow } from "./HabitRow";

type Props = {
  title: string;
  emoji: string;
  accent: string;
  habits: Habit[];
  dayKeys: string[];
  dateLookup: Record<string, Date>;
  completed: (habitId: string, dateKey: string) => boolean;
  onToggle: (habitId: string, date: Date) => void;
};

export const CategorySection = ({
  title,
  emoji,
  accent,
  habits,
  dayKeys,
  dateLookup,
  completed,
  onToggle,
}: Props) => (
  <section className="mb-4 rounded-xl border border-stone-100 bg-white/80 p-3">
    <div className="mb-2 rounded-lg px-3 py-2 font-semibold" style={{ backgroundColor: `${accent}55` }}>
      {emoji} {title.toUpperCase()}
    </div>
    {habits.map((habit) => (
      <HabitRow
        key={habit.id}
        habit={habit}
        dayKeys={dayKeys}
        dateLookup={dateLookup}
        completed={completed}
        onToggle={onToggle}
      />
    ))}
  </section>
);
