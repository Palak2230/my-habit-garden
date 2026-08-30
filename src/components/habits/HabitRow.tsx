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
      <div className="flex flex-wrap items-center gap-2">
        <span>
          {habit.emoji} {habit.name}
        </span>
        <div className="flex items-center gap-0.5" title="Weekly goal (days)">
          {Array.from({ length: 7 }, (_, i) => {
            const day = i + 1;
            const active = day <= habit.weeklyGoal;
            return (
              <button
                key={day}
                type="button"
                onClick={() => onWeeklyGoalChange(habit.id, day)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  active ? "bg-rose-300" : "bg-stone-200 hover:bg-stone-300"
                }`}
                aria-label={`Set weekly goal to ${day} for ${habit.name}`}
              />
            );
          })}
        </div>
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
