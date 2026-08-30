import { Link } from "react-router-dom";

type Props = {
  progressText: string;
  streak: number;
};

export const OverviewCards = ({ progressText, streak }: Props) => (
  <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <article className="rounded-2xl border border-rose-100 bg-white/80 p-4">
      <h3 className="text-sm font-semibold text-rose-900">🌷 Habit Progress</h3>
      <p className="mt-2 text-2xl font-bold">{progressText}</p>
      <Link className="mt-3 inline-block text-sm text-rose-700 hover:underline" to="/habits">
        Open Habit Tracker →
      </Link>
    </article>

    <article className="rounded-2xl border border-amber-100 bg-white/80 p-4">
      <h3 className="text-sm font-semibold text-amber-900">🔥 Current Streak</h3>
      <p className="mt-2 text-2xl font-bold">{streak} days</p>
    </article>

    {[
      ["😊 Mood", "/mood"],
      ["💰 Expenses", "/expenses"],
      ["💎 Net Worth", "/net-worth"],
      ["💼 Work", "/work"],
    ].map(([title, to]) => (
      <Link key={title} to={to} className="rounded-2xl border border-stone-100 bg-white/75 p-4 hover:bg-white">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-stone-500">Coming soon</p>
      </Link>
    ))}
  </section>
);
