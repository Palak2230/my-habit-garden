import type { Habit } from "../../types/habit";

type Props = {
  habit: Habit;
  dayKeys: string[];
  dateLookup: Record<string, Date>;
  completed: (habitId: string, dateKey: string) => boolean;
  onToggle: (habitId: string, date: Date) => void;
};

export const HabitRow = ({ habit, dayKeys, dateLookup, completed, onToggle }: Props) => (
  <div className="grid grid-cols-[180px_repeat(7,minmax(42px,1fr))] items-center gap-1 py-1">
    <div className="text-sm">
      {habit.emoji} {habit.name}
    </div>
    {dayKeys.map((dayKey) => (
      <label key={`${habit.id}-${dayKey}`} className="mx-auto flex h-8 w-8 items-center justify-center rounded-md hover:bg-rose-50">
        <input
          type="checkbox"
          checked={completed(habit.id, dayKey)}
          onChange={() => onToggle(habit.id, dateLookup[dayKey])}
          aria-label={`${habit.name} on ${dayKey}`}
        />
      </label>
    ))}
  </div>
);
