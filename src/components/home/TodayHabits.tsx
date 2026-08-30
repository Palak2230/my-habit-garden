import type { Habit } from "../../types/habit";

type Props = {
  grouped: { category: string; emoji: string; habits: Habit[] }[];
  isCompleted: (habitId: string) => boolean;
  onToggle: (habitId: string) => void;
};

export const TodayHabits = ({ grouped, isCompleted, onToggle }: Props) => (
  <section className="rounded-2xl border border-rose-100 bg-white/80 p-4">
    <h2 className="mb-3 text-lg font-semibold text-rose-900">🌷 Today&apos;s Habits</h2>
    <div className="space-y-4">
      {grouped.map((group) => (
        <div key={group.category}>
          <h3 className="mb-2 text-sm font-semibold">
            {group.emoji} {group.category}
          </h3>
          <div className="space-y-1">
            {group.habits.map((habit) => (
              <label key={habit.id} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-rose-50">
                <input
                  aria-label={`Toggle ${habit.name}`}
                  checked={isCompleted(habit.id)}
                  onChange={() => onToggle(habit.id)}
                  type="checkbox"
                />
                <span>
                  {habit.emoji} {habit.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);
