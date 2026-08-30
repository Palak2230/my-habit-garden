import { useHabits } from "../../hooks/useHabits";

export const ManageHabits = () => {
  const { data, deactivateHabit, reorderHabit } = useHabits();
  const activeHabits = data.habits.filter((h) => h.active).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-rose-900">🌷 Your Habits</h1>
      <div className="rounded-2xl border border-rose-100 bg-white/80 p-4">
        {activeHabits.map((habit) => (
          <div key={habit.id} className="mb-2 flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2">
            <span>{habit.emoji} {habit.name}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => reorderHabit(habit.id, "up")} className="rounded bg-stone-100 px-2">↑</button>
              <button type="button" onClick={() => reorderHabit(habit.id, "down")} className="rounded bg-stone-100 px-2">↓</button>
              <button type="button" onClick={() => deactivateHabit(habit.id)} className="rounded bg-rose-100 px-2 text-rose-900">Deactivate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
