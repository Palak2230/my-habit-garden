import type { Completion } from "../../types/completion";
import type { Habit } from "../../types/habit";
import { HabitDayCell } from "./HabitDayCell";

type Props = {
  habit: Habit;
  dayKeys: string[];
  dateLookup: Record<string, Date>;
  weeklyDone: number;
  onWeeklyGoalChange: (habitId: string, weeklyGoal: number) => void;
  onReorder?: (habitId: string, direction: "up" | "down") => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  getCompletion: (habitId: string, dateKey: string) => Completion | undefined;
  onCompletionChange: (
    habitId: string,
    date: Date,
    update: { completed?: boolean; skipped?: boolean; note?: string },
  ) => void;
};

export const HabitRow = ({
  habit,
  dayKeys,
  dateLookup,
  weeklyDone,
  onWeeklyGoalChange,
  onReorder,
  canMoveUp = false,
  canMoveDown = false,
  getCompletion,
  onCompletionChange,
}: Props) => (
  <div className="group/row grid grid-cols-[270px_repeat(7,minmax(42px,1fr))_130px] items-center gap-1 py-1">
    <div className="text-sm">
      <div className="flex flex-wrap items-center gap-1.5">
        {onReorder && (
          <span className="flex flex-col">
            <button
              type="button"
              disabled={!canMoveUp}
              onClick={() => onReorder(habit.id, "up")}
              className="rounded px-0.5 text-[10px] text-stone-400 hover:bg-stone-100 disabled:opacity-30"
              aria-label={`Move ${habit.name} up`}
            >
              ↑
            </button>
            <button
              type="button"
              disabled={!canMoveDown}
              onClick={() => onReorder(habit.id, "down")}
              className="rounded px-0.5 text-[10px] text-stone-400 hover:bg-stone-100 disabled:opacity-30"
              aria-label={`Move ${habit.name} down`}
            >
              ↓
            </button>
          </span>
        )}
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
      <HabitDayCell
        key={`${habit.id}-${dayKey}`}
        habitName={habit.name}
        dayKey={dayKey}
        completion={getCompletion(habit.id, dayKey)}
        onChange={(update) => onCompletionChange(habit.id, dateLookup[dayKey], update)}
      />
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
