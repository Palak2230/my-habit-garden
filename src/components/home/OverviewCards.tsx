import { Link } from "react-router-dom";

type Props = {
  progressText: string;
  todayPassPercent: number;
  streak: number;
  weeklyPercent: number;
  sectionsPassedText: string;
};

export const OverviewCards = ({
  progressText,
  todayPassPercent,
  streak,
  weeklyPercent,
  sectionsPassedText,
}: Props) => (
  <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <article className="rounded-2xl border border-rose-100 bg-white/80 p-4">
      <h3 className="text-sm font-semibold text-rose-900">🌷 Habit Progress</h3>
      <p className="mt-2 text-2xl font-bold">{progressText}</p>
      <p className="mt-1 text-sm text-stone-500">{todayPassPercent}% done today</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full rounded-full bg-rose-300" style={{ width: `${todayPassPercent}%` }} />
      </div>
      <Link className="mt-3 inline-block text-sm text-rose-700 hover:underline" to="/habits">
        Open Habit Tracker →
      </Link>
    </article>

    <article className="rounded-2xl border border-amber-100 bg-white/80 p-4">
      <h3 className="text-sm font-semibold text-amber-900">🔥 Current Streak</h3>
      <p className="mt-2 text-2xl font-bold">{streak} days</p>
    </article>

    <article className="rounded-2xl border border-emerald-100 bg-white/80 p-4">
      <h3 className="text-sm font-semibold text-emerald-900">📅 Weekly Pass</h3>
      <p className="mt-2 text-2xl font-bold">{weeklyPercent}%</p>
      <p className="mt-1 text-sm text-stone-500">This week&apos;s completion</p>
    </article>

    <article className="rounded-2xl border border-violet-100 bg-white/80 p-4">
      <h3 className="text-sm font-semibold text-violet-900">✅ Sections Today</h3>
      <p className="mt-2 text-2xl font-bold">{sectionsPassedText}</p>
      <p className="mt-1 text-sm text-stone-500">Sections meeting pass threshold</p>
    </article>

    {[
      ["😊 Mood", "/mood"],
      ["💰 Expenses", "/expenses"],
    ].map(([title, to]) => (
      <Link key={title} to={to} className="rounded-2xl border border-stone-100 bg-white/75 p-4 hover:bg-white">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-stone-500">Coming soon</p>
      </Link>
    ))}
  </section>
);
