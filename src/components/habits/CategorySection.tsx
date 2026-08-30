import type { Habit, HabitCategoryId } from "../../types/habit";
import { HabitRow } from "./HabitRow";
import { SectionPassBadge, SectionPassRow } from "./SectionPassRow";

type Props = {
  categoryId: string;
  title: string;
  emoji: string;
  accent: string;
  habits: Habit[];
  dayKeys: string[];
  dateLookup: Record<string, Date>;
  onWeeklyGoalChange: (habitId: string, weeklyGoal: number) => void;
  onAddSectionHabit: (input: { categoryId: HabitCategoryId; prefix?: string }) => void;
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
  onAddSectionHabit,
  completed,
  onToggle,
}: Props) => {
  const habitIds = habits.map((habit) => habit.id);

  return (
    <section className="mb-4 rounded-xl border border-stone-100 bg-white/80 p-3">
      <div
        className="mb-2 flex items-center justify-between rounded-lg px-3 py-2 font-semibold"
        style={{ backgroundColor: `${accent}55` }}
      >
        <span>
          {emoji} {title.toUpperCase()}
        </span>
        <div className="flex items-center gap-2">
          <SectionPassBadge habitIds={habitIds} dayKeys={dayKeys} completed={completed} />
          {categoryId !== "skincare" && (
            <button
              type="button"
              onClick={() => onAddSectionHabit({ categoryId: categoryId as HabitCategoryId })}
              className="rounded-md bg-white/70 px-2 text-sm text-rose-900 hover:bg-white"
              aria-label={`Add habit to ${title}`}
            >
              +
            </button>
          )}
        </div>
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
            onAdd={() => onAddSectionHabit({ categoryId: "skincare", prefix: "AM •" })}
            trimPrefix="AM •"
          />
          <RoutineBlock
            label="🌙 PM Routine"
            habits={habits.filter((habit) => habit.name.startsWith("PM •"))}
            dayKeys={dayKeys}
            dateLookup={dateLookup}
            onWeeklyGoalChange={onWeeklyGoalChange}
            completed={completed}
            onToggle={onToggle}
            onAdd={() => onAddSectionHabit({ categoryId: "skincare", prefix: "PM •" })}
            trimPrefix="PM •"
          />
          <RoutineBlock
            label="✨ Other"
            habits={habits.filter(
              (habit) => !habit.name.startsWith("AM •") && !habit.name.startsWith("PM •"),
            )}
            dayKeys={dayKeys}
            dateLookup={dateLookup}
            onWeeklyGoalChange={onWeeklyGoalChange}
            completed={completed}
            onToggle={onToggle}
            onAdd={() => onAddSectionHabit({ categoryId: "skincare" })}
          />
          <SectionPassRow habitIds={habitIds} dayKeys={dayKeys} completed={completed} label="Skincare daily pass" />
        </>
      ) : (
        <>
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
          <SectionPassRow habitIds={habitIds} dayKeys={dayKeys} completed={completed} />
        </>
      )}
    </section>
  );
};

const RoutineBlock = ({
  label,
  habits,
  dayKeys,
  dateLookup,
  onWeeklyGoalChange,
  completed,
  onToggle,
  alwaysShow = false,
  onAdd,
  emptyStateText,
  trimPrefix,
}: {
  label: string;
  habits: Habit[];
  dayKeys: string[];
  dateLookup: Record<string, Date>;
  onWeeklyGoalChange: (habitId: string, weeklyGoal: number) => void;
  completed: (habitId: string, dateKey: string) => boolean;
  onToggle: (habitId: string, date: Date) => void;
  alwaysShow?: boolean;
  onAdd?: () => void;
  emptyStateText?: string;
  trimPrefix?: string;
}) => {
  if (!habits.length && !alwaysShow) return null;
  const habitIds = habits.map((habit) => habit.id);

  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-stone-500">
        <div className="flex items-center gap-2">
          <span>{label}</span>
          <SectionPassBadge habitIds={habitIds} dayKeys={dayKeys} completed={completed} />
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="rounded px-1.5 text-sm text-rose-700 hover:bg-rose-50"
            aria-label={`Add habit to ${label}`}
          >
            +
          </button>
        )}
      </div>
      {habits.length ? (
        habits.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={{
              ...habit,
              name:
                trimPrefix && habit.name.startsWith(trimPrefix)
                  ? habit.name.slice(trimPrefix.length).trim()
                  : habit.name,
            }}
            dayKeys={dayKeys}
            dateLookup={dateLookup}
            weeklyDone={dayKeys.filter((dayKey) => completed(habit.id, dayKey)).length}
            onWeeklyGoalChange={onWeeklyGoalChange}
            completed={completed}
            onToggle={onToggle}
          />
        ))
      ) : (
        <div className="rounded-md border border-dashed border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-500">
          {emptyStateText ?? "No habits in this section yet."}
        </div>
      )}
      <SectionPassRow habitIds={habitIds} dayKeys={dayKeys} completed={completed} label={`${label} daily pass`} />
    </div>
  );
};
