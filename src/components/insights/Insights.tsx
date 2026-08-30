import { useHabits } from "../../hooks/useHabits";
import { useWeek } from "../../hooks/useWeek";
import { WeeklyChart } from "../habits/WeeklyChart";

export const Insights = () => {
  const { statsForWeek, data } = useHabits();
  const { reference } = useWeek();
  const stats = statsForWeek(reference);

  const worstHabit = data.habits
    .filter((h) => h.active)
    .map((habit) => ({
      habit,
      done: data.completions.filter((c) => c.habitId === habit.id && c.completed).length,
    }))
    .sort((a, b) => a.done - b.done)[0]?.habit;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-rose-900">📊 Insights</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Overall completion" value={`${stats.weeklyPercent}%`} />
        <Stat label="Current streak" value={`${stats.streak} days`} />
        <Stat label="Longest streak" value={`${stats.longest} days`} />
        <Stat label="Best habit" value={stats.bestHabit?.name ?? "—"} />
        <Stat label="Needs love" value={worstHabit?.name ?? "—"} />
      </div>
      <WeeklyChart data={stats.dailySeries} />
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <article className="rounded-xl border border-rose-100 bg-white/80 p-3">
    <div className="text-sm text-stone-500">{label}</div>
    <div className="mt-1 text-lg font-semibold">{value}</div>
  </article>
);
