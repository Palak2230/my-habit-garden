import { useCollapsedSections } from "../../hooks/useCollapsedSections";
import type { Completion } from "../../types/completion";
import type { Habit, HabitCategoryId } from "../../types/habit";
import { HabitRow } from "./HabitRow";
import { PassThresholdInput } from "./PassThresholdInput";
import { SectionPassBadge, SectionPassRow } from "./SectionPassRow";

type Props = {
  categoryId: string;
  title: string;
  emoji: string;
  accent: string;
  habits: Habit[];
  dayKeys: string[];
  dateLookup: Record<string, Date>;
  resolvePassThreshold: (sectionKey: string) => number;
  onPassThresholdChange: (sectionKey: string, value: number) => void;
  onWeeklyGoalChange: (habitId: string, weeklyGoal: number) => void;
  onReorderHabit: (habitId: string, direction: "up" | "down") => void;
  onAddSectionHabit: (input: { categoryId: HabitCategoryId; prefix?: string }) => void;
  completed: (habitId: string, dateKey: string) => boolean;
  getCompletion: (habitId: string, dateKey: string) => Completion | undefined;
  onCompletionChange: (
    habitId: string,
    date: Date,
    update: { completed?: boolean; skipped?: boolean; note?: string },
  ) => void;
  isExcusedDay?: (dayKey: string) => boolean;
};

export const CategorySection = ({
  categoryId,
  title,
  emoji,
  accent,
  habits,
  dayKeys,
  dateLookup,
  resolvePassThreshold,
  onPassThresholdChange,
  onWeeklyGoalChange,
  onReorderHabit,
  onAddSectionHabit,
  completed,
  getCompletion,
  onCompletionChange,
  isExcusedDay,
}: Props) => {
  const { isCollapsed, toggle } = useCollapsedSections();
  const habitIds = habits.map((habit) => habit.id);
  const collapsed = isCollapsed(categoryId);
  const categoryPassThreshold = resolvePassThreshold(categoryId);

  const rowProps = {
    dayKeys,
    dateLookup,
    getCompletion,
    onCompletionChange,
    onWeeklyGoalChange,
    onReorder: onReorderHabit,
  };

  return (
    <section className="mb-4 rounded-xl border border-stone-100 bg-white/80 p-3">
      <button
        type="button"
        onClick={() => toggle(categoryId)}
        className="mb-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-semibold"
        style={{ backgroundColor: `${accent}55` }}
      >
        <span>
          {collapsed ? "▸" : "▾"} {emoji} {title.toUpperCase()}
        </span>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <PassThresholdInput
            compact
            value={categoryPassThreshold}
            onChange={(value) => onPassThresholdChange(categoryId, value)}
          />
          <SectionPassBadge
            habitIds={habitIds}
            dayKeys={dayKeys}
            completed={completed}
            passThreshold={categoryPassThreshold}
            isExcusedDay={isExcusedDay}
          />
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
      </button>
      {!collapsed &&
        (categoryId === "skincare" ? (
          <>
            <RoutineBlock
              sectionId={`${categoryId}-am`}
              label="☀️ AM Routine"
              habits={habits.filter((habit) => habit.name.startsWith("AM •"))}
              passThreshold={categoryPassThreshold}
              showDailyPass={false}
              completed={completed}
              isExcusedDay={isExcusedDay}
              onReorderHabit={onReorderHabit}
              onAdd={() => onAddSectionHabit({ categoryId: "skincare", prefix: "AM •" })}
              trimPrefix="AM •"
              {...rowProps}
            />
            <RoutineBlock
              sectionId={`${categoryId}-pm`}
              label="🌙 PM Routine"
              habits={habits.filter((habit) => habit.name.startsWith("PM •"))}
              passThreshold={categoryPassThreshold}
              showDailyPass={false}
              completed={completed}
              isExcusedDay={isExcusedDay}
              onReorderHabit={onReorderHabit}
              onAdd={() => onAddSectionHabit({ categoryId: "skincare", prefix: "PM •" })}
              trimPrefix="PM •"
              {...rowProps}
            />
            <RoutineBlock
              sectionId={`${categoryId}-other`}
              label="✨ Other"
              habits={habits.filter(
                (habit) => !habit.name.startsWith("AM •") && !habit.name.startsWith("PM •"),
              )}
              passThreshold={categoryPassThreshold}
              completed={completed}
              isExcusedDay={isExcusedDay}
              onReorderHabit={onReorderHabit}
              onAdd={() => onAddSectionHabit({ categoryId: "skincare" })}
              {...rowProps}
            />
            <SectionPassRow
              habitIds={habitIds}
              dayKeys={dayKeys}
              completed={completed}
              passThreshold={categoryPassThreshold}
              label="Skincare daily pass"
              isExcusedDay={isExcusedDay}
            />
          </>
        ) : (
          <>
            {habits.map((habit, index) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                weeklyDone={dayKeys.filter((dayKey) => completed(habit.id, dayKey)).length}
                canMoveUp={index > 0}
                canMoveDown={index < habits.length - 1}
                {...rowProps}
              />
            ))}
            <SectionPassRow
              habitIds={habitIds}
              dayKeys={dayKeys}
              completed={completed}
              passThreshold={categoryPassThreshold}
              isExcusedDay={isExcusedDay}
            />
          </>
        ))}
    </section>
  );
};

const RoutineBlock = ({
  sectionId,
  label,
  habits,
  dayKeys,
  dateLookup,
  passThreshold,
  onWeeklyGoalChange,
  onReorderHabit,
  completed,
  getCompletion,
  onCompletionChange,
  alwaysShow = false,
  onAdd,
  emptyStateText,
  trimPrefix,
  showDailyPass = true,
  isExcusedDay,
}: {
  sectionId: string;
  label: string;
  habits: Habit[];
  dayKeys: string[];
  dateLookup: Record<string, Date>;
  passThreshold: number;
  onWeeklyGoalChange: (habitId: string, weeklyGoal: number) => void;
  onReorderHabit: (habitId: string, direction: "up" | "down") => void;
  completed: (habitId: string, dateKey: string) => boolean;
  getCompletion: (habitId: string, dateKey: string) => Completion | undefined;
  onCompletionChange: (
    habitId: string,
    date: Date,
    update: { completed?: boolean; skipped?: boolean; note?: string },
  ) => void;
  alwaysShow?: boolean;
  onAdd?: () => void;
  emptyStateText?: string;
  trimPrefix?: string;
  showDailyPass?: boolean;
  isExcusedDay?: (dayKey: string) => boolean;
}) => {
  const { isCollapsed, toggle } = useCollapsedSections();
  if (!habits.length && !alwaysShow) return null;
  const habitIds = habits.map((habit) => habit.id);
  const collapsed = isCollapsed(sectionId);

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => toggle(sectionId)}
        className="mb-1 flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wide text-stone-500"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span>
            {collapsed ? "▸" : "▾"} {label}
          </span>
          <SectionPassBadge
            habitIds={habitIds}
            dayKeys={dayKeys}
            completed={completed}
            passThreshold={passThreshold}
            isExcusedDay={isExcusedDay}
          />
        </div>
        {onAdd && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onAdd();
              }
            }}
            className="rounded px-1.5 text-sm text-rose-700 hover:bg-rose-50"
            aria-label={`Add habit to ${label}`}
          >
            +
          </span>
        )}
      </button>
      {!collapsed &&
        (habits.length ? (
          habits.map((habit, index) => (
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
              onReorder={onReorderHabit}
              canMoveUp={index > 0}
              canMoveDown={index < habits.length - 1}
              getCompletion={getCompletion}
              onCompletionChange={onCompletionChange}
            />
          ))
        ) : (
          <div className="rounded-md border border-dashed border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-500">
            {emptyStateText ?? "No habits in this section yet."}
          </div>
        ))}
      {!collapsed && showDailyPass && (
        <SectionPassRow
          habitIds={habitIds}
          dayKeys={dayKeys}
          completed={completed}
          passThreshold={passThreshold}
          label={`${label} daily pass`}
          isExcusedDay={isExcusedDay}
        />
      )}
    </div>
  );
};
