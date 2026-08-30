import { useState } from "react";
import type { HabitCategoryId } from "../../types/habit";

type Props = {
  onClose: () => void;
  onAdd: (input: { name: string; emoji: string; categoryId: HabitCategoryId; weeklyGoal: number }) => void;
};

export const AddHabitModal = ({ onClose, onAdd }: Props) => {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🌷");
  const [categoryId, setCategoryId] = useState<HabitCategoryId>("skincare");
  const [weeklyGoal, setWeeklyGoal] = useState(7);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-rose-900">+ Add Habit</h3>
        <div className="mt-3 space-y-3">
          <label className="block">
            <span className="text-sm">Habit Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm">Emoji</span>
            <input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm">Category</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as HabitCategoryId)}
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
            >
              <option value="skincare">🧴 Skincare</option>
              <option value="bodycare">🫧 Bodycare</option>
              <option value="haircare">💆 Hair Care</option>
              <option value="productivity">📚 Productivity</option>
              <option value="health">💪 Health</option>
              <option value="supplements">💊 Supplements</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm">Weekly Goal (days out of 7)</span>
            <input
              type="number"
              min={1}
              max={7}
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(Math.max(1, Math.min(7, Number(e.target.value) || 1)))}
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-stone-500">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!name.trim()) return;
              onAdd({ name: name.trim(), emoji: emoji.trim() || "🌷", categoryId, weeklyGoal });
              onClose();
            }}
            className="rounded-lg bg-rose-200 px-3 py-2 text-sm font-medium text-rose-900"
          >
            Add Habit
          </button>
        </div>
      </div>
    </div>
  );
};
