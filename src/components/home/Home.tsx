import { useMemo } from "react";
import { useCompletions } from "../../hooks/useCompletions";
import { useHabits } from "../../hooks/useHabits";
import { toDateKey } from "../../utils/dates";
import { dailySectionPass, resolvePassThreshold } from "../../utils/sectionPass";
import { currentStreak } from "../../utils/streaks";
import { OverviewCards } from "./OverviewCards";
import { QuickActions } from "./QuickActions";
import { TodayHabits } from "./TodayHabits";

export const Home = () => {
  const { data, statsForWeek } = useHabits();
  const { toggleCompletion, isCompleted, isExcusedDayKey } = useCompletions();
  const today = new Date();
  const todayKey = toDateKey(today);
  const activeHabits = data.habits.filter((h) => h.active);
  const getPassThreshold = (sectionKey: string) => resolvePassThreshold(data.settings, sectionKey);

  const grouped = useMemo(
    () =>
      data.categories
        .sort((a, b) => a.order - b.order)
        .map((category) => ({
          category: category.name,
          emoji: category.emoji,
          habits: activeHabits.filter((h) => h.categoryId === category.id).sort((a, b) => a.order - b.order),
        }))
        .filter((group) => group.habits.length > 0),
    [activeHabits, data.categories],
  );

  const doneCount = activeHabits.filter((habit) =>
    data.completions.some((c) => c.habitId === habit.id && c.date === todayKey && c.completed),
  ).length;
  const todayPassPercent = activeHabits.length
    ? Math.round((doneCount / activeHabits.length) * 100)
    : 0;
  const streak = currentStreak(activeHabits, data.completions, data.dayStatuses);
  const weeklyPercent = statsForWeek(today).weeklyPercent;
  const sectionsWithHabits = data.categories
    .map((category) => ({
      id: category.id,
      habitIds: activeHabits.filter((h) => h.categoryId === category.id).map((h) => h.id),
    }))
    .filter((section) => section.habitIds.length > 0);
  const sectionsPassedToday = sectionsWithHabits.filter((section) =>
    dailySectionPass(
      section.habitIds,
      todayKey,
      (habitId, dateKey) =>
        data.completions.some((c) => c.habitId === habitId && c.date === dateKey && c.completed),
      getPassThreshold(section.id),
      isExcusedDayKey(todayKey),
    ).passed,
  ).length;
  const name = data.settings.displayName ? `, ${data.settings.displayName}` : "";

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-rose-900">🌷 Good morning{name} ♡</h1>
        <p className="text-stone-500">Let&apos;s make today a good one.</p>
      </header>

      <OverviewCards
        progressText={`${doneCount} / ${activeHabits.length}`}
        todayPassPercent={todayPassPercent}
        streak={streak}
        weeklyPercent={weeklyPercent}
        sectionsPassedText={`${sectionsPassedToday} / ${sectionsWithHabits.length}`}
      />

      <TodayHabits
        grouped={grouped}
        isCompleted={(habitId) => isCompleted(habitId, today)}
        onToggle={(habitId) => toggleCompletion(habitId, today)}
      />

      <QuickActions />
    </div>
  );
};
