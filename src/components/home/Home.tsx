import { useMemo } from "react";
import { useCompletions } from "../../hooks/useCompletions";
import { useHabits } from "../../hooks/useHabits";
import { currentStreak } from "../../utils/streaks";
import { toDateKey } from "../../utils/dates";
import { OverviewCards } from "./OverviewCards";
import { QuickActions } from "./QuickActions";
import { TodayHabits } from "./TodayHabits";

export const Home = () => {
  const { data } = useHabits();
  const { toggleCompletion, isCompleted } = useCompletions();
  const today = new Date();
  const todayKey = toDateKey(today);
  const activeHabits = data.habits.filter((h) => h.active);

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

  const doneCount = data.completions.filter((c) => c.date === todayKey && c.completed).length;
  const streak = currentStreak(activeHabits, data.completions);
  const name = data.settings.displayName ? `, ${data.settings.displayName}` : "";

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-rose-900">🌷 Good morning{name} ♡</h1>
        <p className="text-stone-500">Let&apos;s make today a good one.</p>
      </header>

      <OverviewCards progressText={`${doneCount} / ${activeHabits.length}`} streak={streak} />

      <TodayHabits
        grouped={grouped}
        isCompleted={(habitId) => isCompleted(habitId, today)}
        onToggle={(habitId) => toggleCompletion(habitId, today)}
      />

      <QuickActions />
    </div>
  );
};
