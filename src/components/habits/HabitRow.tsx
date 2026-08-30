import type { Habit } from "../../types/habit";

type Props = {
  habit: Habit;
  dayKeys: string[];
  dateLookup: Record<string, Date>;
  weeklyDone: number;
  onWeeklyGoalChange: (habitId: string, weeklyGoal: number) => void;
  completed: (habitId: string, dateKey: string) => boolean;
  onToggle: (habitId: string, date: Date) => void;
};

export const HabitRow = ({ habit, dayKeys, dateLookup, weeklyDone, onWeeklyGoalChange, completed, onToggle }: Props) => (
  <div className="grid grid-cols-[270px_repeat(7,minmax(42px,1fr))_130px] items-center gap-1 py-1">
    <div className="text-sm">
      <div className="flex items-center gap-2">
        <span>
          {habit.emoji} {habit.name}
        </span>
        <input
          type="number"
          min={1}
          max={7}
          value={habit.weeklyGoal}
          onChange={(e) => onWeeklyGoalChange(habit.id, Math.max(1, Math.min(7, Number(e.target.value) || 1)))}
          className="w-14 rounded border border-stone-200 px-1 py-0.5 text-xs"
          aria-label={`${habit.name} weekly goal`}
        />
      </div>
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
    <div className="pr-1">
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className={`h-full rounded-full transition-all ${weeklyDone >= habit.weeklyGoal ? "bg-emerald-400" : "bg-rose-300"}`}
          style={{ width: `${Math.min(100, Math.round((weeklyDone / Math.max(1, habit.weeklyGoal)) * 100))}%` }}
        />
      </div>
      <div className="mt-1 text-right text-[10px] text-stone-500">
        {Math.min(100, Math.round((weeklyDone / Math.max(1, habit.weeklyGoal)) * 100))}%
      </div>
    </div>
  </div>
);
