import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCompletions } from "../../hooks/useCompletions";
import { useHabits } from "../../hooks/useHabits";
import { useWeek } from "../../hooks/useWeek";
import { toDateKey, isSameDay, startOfWeekMonday } from "../../utils/dates";
import { clampThreshold, resolvePassThreshold } from "../../utils/sectionPass";
import { AddHabitModal } from "./AddHabitModal";
import { CategorySection } from "./CategorySection";
import { DayStatusPicker } from "./DayStatusPicker";
import { MonthlyView } from "./MonthlyView";
import { WeekNavigation } from "./WeekNavigation";
import { WeeklyChart } from "./WeeklyChart";
import { WeeklyReflection } from "./WeeklyReflection";
import { WeeklyStats } from "./WeeklyStats";

export const HabitTracker = () => {
  const { data, addHabit, statsForWeek, updateReflection, updateHabit, reorderHabit, updateSettings, getCompletion, setCompletion } =
    useHabits();
  const { isCompleted, setDayStatus, getDayStatusForKey, isExcusedDayKey } = useCompletions();
  const { reference, days, rangeLabel, goPrev, goNext, goThisWeek } = useWeek();
  const [adding, setAdding] = useState(false);
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");

  const dayKeys = days.map(toDateKey);
  const dateLookup = Object.fromEntries(days.map((date) => [toDateKey(date), date]));
  const today = new Date();
  const inCurrentWeek = isSameDay(startOfWeekMonday(today), startOfWeekMonday(reference));

  const stats = statsForWeek(reference);

  const getPassThreshold = useMemo(
    () => (sectionKey: string) => resolvePassThreshold(data.settings, sectionKey),
    [data.settings],
  );

  const handlePassThresholdChange = (sectionKey: string, value: number) => {
    updateSettings({
      sectionPassThresholds: {
        ...data.settings.sectionPassThresholds,
        [sectionKey]: clampThreshold(value),
      },
    });
  };

  const categories = useMemo(
    () =>
      data.categories
        .sort((a, b) => a.order - b.order)
        .map((category) => ({
          ...category,
          habits: data.habits
            .filter((h) => h.active && h.categoryId === category.id)
            .sort((a, b) => a.order - b.order),
        })),
    [data.categories, data.habits],
  );

  return (
    <div>
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-rose-900">🌷 Habit Tracker</h1>
          <p className="text-stone-500">small habits • big changes ♡</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="rounded-lg bg-rose-200 px-3 py-2 text-sm font-medium text-rose-900" onClick={() => setAdding(true)}>
            + Add Habit
          </button>
          <Link to="/habits/manage" className="rounded-lg border border-rose-200 px-3 py-2 text-sm">
            Remove Habit
          </Link>
        </div>
      </header>

      <div className="mb-3 inline-flex rounded-lg border border-rose-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setViewMode("weekly")}
          className={`rounded px-3 py-1 text-sm ${viewMode === "weekly" ? "bg-rose-100 text-rose-900" : ""}`}
        >
          Weekly
        </button>
        <button
          type="button"
          onClick={() => setViewMode("monthly")}
          className={`rounded px-3 py-1 text-sm ${viewMode === "monthly" ? "bg-rose-100 text-rose-900" : ""}`}
        >
          Monthly
        </button>
      </div>

      {viewMode === "weekly" ? (
        <>
          <WeekNavigation rangeLabel={rangeLabel} onPrev={goPrev} onNext={goNext} onThisWeek={goThisWeek} />

          <div className="mb-2 grid grid-cols-[270px_repeat(7,minmax(42px,1fr))_130px] gap-1 text-center text-xs font-semibold text-stone-500">
            <div className="text-left text-[10px] font-normal text-stone-400">Day type</div>
            {days.map((day) => {
              const key = toDateKey(day);
              const isToday = inCurrentWeek && isSameDay(day, today);
              return (
                <DayStatusPicker
                  key={key}
                  dayKey={key}
                  label={`${day.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()} ${day.getDate()}`}
                  isToday={isToday}
                  status={getDayStatusForKey(key)}
                  onChange={(type) => setDayStatus(day, type)}
                />
              );
            })}
            <div />
          </div>

          {categories.map((category) => (
            <CategorySection
              key={category.id}
              categoryId={category.id}
              title={category.name}
              emoji={category.emoji}
              accent={category.accent}
              habits={category.habits}
              dayKeys={dayKeys}
              dateLookup={dateLookup}
              resolvePassThreshold={getPassThreshold}
              onPassThresholdChange={handlePassThresholdChange}
              onWeeklyGoalChange={(habitId, weeklyGoal) => {
                const habit = data.habits.find((h) => h.id === habitId);
                if (!habit) return;
                updateHabit({ ...habit, weeklyGoal });
              }}
              onReorderHabit={reorderHabit}
              onAddSectionHabit={({ categoryId, prefix }) => {
                const entered = window.prompt("Enter habit name");
                const rawName = entered?.trim() ?? "";
                if (!rawName) return;
                const prefixText = prefix?.trim();
                const normalizedName =
                  prefixText && rawName.toLowerCase().startsWith(prefixText.toLowerCase())
                    ? rawName.slice(prefixText.length).trim()
                    : rawName;
                if (!normalizedName) return;
                const defaultEmoji =
                  prefix === "AM •"
                    ? "☀️"
                    : prefix === "PM •"
                      ? "🌙"
                      : categoryId === "beforesleep"
                        ? "🌙"
                        : data.categories.find((category) => category.id === categoryId)?.emoji ?? "🌷";
                addHabit({
                  name: prefixText ? `${prefixText} ${normalizedName}` : normalizedName,
                  emoji: defaultEmoji,
                  categoryId,
                  weeklyGoal: 7,
                });
              }}
              completed={(habitId, dateKey) => isCompleted(habitId, dateLookup[dateKey])}
              getCompletion={getCompletion}
              onCompletionChange={setCompletion}
              isExcusedDay={isExcusedDayKey}
            />
          ))}

          <WeeklyStats
            completion={stats.weeklyPercent}
            streak={stats.streak}
            bestHabitName={stats.bestHabit?.name ?? ""}
          />
          <WeeklyChart data={stats.dailySeries} />
          <WeeklyReflection
            weekStartKey={toDateKey(startOfWeekMonday(reference))}
            reflections={data.reflections}
            onChange={updateReflection}
          />
        </>
      ) : (
        <MonthlyView
          habits={data.habits}
          completions={data.completions}
          passThreshold={data.settings.sectionPassThreshold}
          onToggle={(habitId, date) => {
            const existing = getCompletion(habitId, toDateKey(date));
            setCompletion(habitId, date, { completed: !existing?.completed, skipped: false });
          }}
        />
      )}

      {adding && <AddHabitModal onClose={() => setAdding(false)} onAdd={addHabit} />}
    </div>
  );
};
