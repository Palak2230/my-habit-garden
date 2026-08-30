import { useMemo, useState } from "react";
import type { Habit } from "../../types/habit";
import { dayPassColorClass } from "../../utils/sectionPass";
import { isSameDay, monthDaysGrid, startOfMonth, toDateKey } from "../../utils/dates";

type Props = {
  habits: Habit[];
  completions: { habitId: string; date: string; completed: boolean }[];
  passThreshold: number;
  onToggle: (habitId: string, date: Date) => void;
};

export const MonthlyView = ({ habits, completions, passThreshold, onToggle }: Props) => {
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const activeHabits = habits.filter((h) => h.active);
  const cells = useMemo(() => monthDaysGrid(monthCursor), [monthCursor]);
  const completionMap = useMemo(
    () => new Map(completions.map((c) => [`${c.habitId}:${c.date}`, c.completed] as const)),
    [completions],
  );

  const dayPercent = (date: Date) => {
    if (!activeHabits.length) return 0;
    const key = toDateKey(date);
    const done = activeHabits.filter((habit) => completionMap.get(`${habit.id}:${key}`)).length;
    return Math.round((done / activeHabits.length) * 100);
  };

  const selectedKey = toDateKey(selectedDate);

  return (
    <section className="rounded-2xl border border-rose-100 bg-white/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          className="rounded px-2 py-1 text-sm hover:bg-rose-50"
          onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
        >
          ←
        </button>
        <h3 className="font-semibold text-rose-900">
          {monthCursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <button
          type="button"
          className="rounded px-2 py-1 text-sm hover:bg-rose-50"
          onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
        >
          →
        </button>
      </div>

      <div className="mb-2 flex flex-wrap gap-2 text-[10px] text-stone-500">
        <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5">Pass</span>
        <span className="rounded border border-rose-100 bg-rose-50 px-1.5 py-0.5">Good</span>
        <span className="rounded border border-amber-100 bg-amber-50 px-1.5 py-0.5">Okay</span>
        <span className="rounded border border-orange-100 bg-orange-50 px-1.5 py-0.5">Low</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-stone-500">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date) => {
          const inMonth = date.getMonth() === monthCursor.getMonth();
          const pct = dayPercent(date);
          return (
            <button
              key={toDateKey(date)}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`rounded-md border p-1 text-left text-xs ${
                inMonth ? dayPassColorClass(pct, passThreshold) : "border-stone-100 bg-stone-50 text-stone-400"
              } ${isSameDay(date, selectedDate) ? "ring-1 ring-rose-300" : ""}`}
              style={{ opacity: inMonth ? 1 : 0.65 }}
            >
              <div className="font-semibold">{date.getDate()}</div>
              <div className="text-[10px] text-stone-600">{pct}%</div>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <h4 className="mb-2 text-sm font-semibold text-stone-700">
          {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
        </h4>
        <div className="space-y-1">
          {activeHabits.map((habit) => {
            const checked = Boolean(completionMap.get(`${habit.id}:${selectedKey}`));
            return (
              <label key={habit.id} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-rose-50">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(habit.id, selectedDate)}
                  aria-label={`${habit.name} on ${selectedKey}`}
                />
                <span>
                  {habit.emoji} {habit.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
};
