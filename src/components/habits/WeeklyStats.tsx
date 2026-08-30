type Props = {
  completion: number;
  streak: number;
  bestHabitName: string;
};

export const WeeklyStats = ({ completion, streak, bestHabitName }: Props) => (
  <section className="mt-4">
    <h3 className="mb-2 text-sm font-semibold text-rose-900">✨ THIS WEEK</h3>
    <div className="grid gap-3 sm:grid-cols-3">
      <StatCard label="Completion" value={`🌷 ${completion}%`} />
      <StatCard label="Streak" value={`🔥 ${streak} days`} />
      <StatCard label="Best Habit" value={`🏆 ${bestHabitName || "—"}`} />
    </div>
  </section>
);

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <article className="rounded-xl border border-rose-100 bg-white/80 p-3">
    <div className="text-lg font-semibold">{value}</div>
    <div className="text-sm text-stone-500">{label}</div>
  </article>
);
