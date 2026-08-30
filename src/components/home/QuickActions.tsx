import { Link } from "react-router-dom";

const actions = [
  { label: "+ Add Habit", to: "/habits/manage" },
  { label: "🌷 Track Habits", to: "/habits" },
  { label: "😊 Mood", to: "/mood" },
  { label: "💡 Idea", to: "/ideas" },
  { label: "💰 Expense", to: "/expenses" },
];

export const QuickActions = () => (
  <section className="rounded-2xl border border-rose-100 bg-white/80 p-4">
    <h2 className="mb-3 text-lg font-semibold text-rose-900">✨ Quick Actions</h2>
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Link
          key={action.label}
          to={action.to}
          className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-sm hover:bg-rose-50"
        >
          {action.label}
        </Link>
      ))}
    </div>
  </section>
);
