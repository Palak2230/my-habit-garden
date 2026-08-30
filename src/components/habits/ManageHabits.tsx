import { useEffect, useState } from "react";
import { useHabits } from "../../hooks/useHabits";
import { UndoBanner } from "../ui/UndoBanner";

export const ManageHabits = () => {
  const { data, deactivateHabit, reactivateHabit, reorderHabit, updateHabit } = useHabits();
  const activeHabits = data.habits.filter((h) => h.active).sort((a, b) => a.order - b.order);
  const [removed, setRemoved] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!removed) return;
    const timer = window.setTimeout(() => setRemoved(null), 5000);
    return () => window.clearTimeout(timer);
  }, [removed]);

  const handleRemove = (habit: { id: string; name: string; emoji: string }) => {
    deactivateHabit(habit.id);
    setRemoved({ id: habit.id, name: `${habit.emoji} ${habit.name}` });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-rose-900">🌷 Your Habits</h1>
      <div className="rounded-2xl border border-rose-100 bg-white/80 p-4">
        {activeHabits.map((habit) => (
          <div key={habit.id} className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-stone-100 px-3 py-2">
            <span>
              {habit.emoji} {habit.name}
            </span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-stone-500">
                Goal
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={habit.weeklyGoal}
                  onChange={(e) =>
                    updateHabit({
                      ...habit,
                      weeklyGoal: Math.max(1, Math.min(7, Number(e.target.value) || 1)),
                    })
                  }
                  className="ml-1 w-14 rounded border border-stone-200 px-1 py-0.5 text-sm"
                />
                /7
              </label>
              <button type="button" onClick={() => reorderHabit(habit.id, "up")} className="rounded bg-stone-100 px-2">
                ↑
              </button>
              <button type="button" onClick={() => reorderHabit(habit.id, "down")} className="rounded bg-stone-100 px-2">
                ↓
              </button>
              <button
                type="button"
                onClick={() => handleRemove(habit)}
                className="rounded bg-rose-100 px-2 text-rose-900"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {removed && (
        <UndoBanner
          message={`Removed ${removed.name}`}
          onUndo={() => {
            reactivateHabit(removed.id);
            setRemoved(null);
          }}
          onDismiss={() => setRemoved(null)}
        />
      )}
    </div>
  );
};
