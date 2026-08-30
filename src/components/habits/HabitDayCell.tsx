import { useEffect, useRef, useState } from "react";
import type { Completion } from "../../types/completion";

type Props = {
  habitName: string;
  dayKey: string;
  completion?: Completion;
  onChange: (update: { completed?: boolean; skipped?: boolean; note?: string }) => void;
};

export const HabitDayCell = ({ habitName, dayKey, completion, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(completion?.note ?? "");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNote(completion?.note ?? "");
  }, [completion?.note, dayKey]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const completed = Boolean(completion?.completed);
  const skipped = Boolean(completion?.skipped);

  return (
    <div className="group/cell relative mx-auto flex h-8 w-8 items-center justify-center">
      <button
        type="button"
        onClick={() => onChange({ completed: !completed, skipped: false, note: completed ? undefined : note })}
        className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs transition-colors ${
          completed
            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
            : skipped
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-stone-200 bg-white hover:bg-rose-50"
        }`}
        title={
          skipped && completion?.note
            ? `Skipped: ${completion.note}`
            : skipped
              ? "Skipped"
              : completed
                ? "Completed"
                : "Mark complete"
        }
        aria-label={`${habitName} on ${dayKey}`}
      >
        {completed ? "✓" : skipped ? "—" : ""}
      </button>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="absolute -right-0.5 -top-0.5 hidden h-3 w-3 items-center justify-center rounded-full bg-stone-200 text-[8px] text-stone-600 group-hover/cell:flex hover:bg-rose-200"
        aria-label={`Note or skip ${habitName} on ${dayKey}`}
      >
        ·
      </button>
      {open && (
        <div
          ref={popoverRef}
          className="absolute left-1/2 top-full z-20 mt-1 w-44 -translate-x-1/2 rounded-lg border border-stone-200 bg-white p-2 shadow-lg"
        >
          <p className="mb-1 text-[10px] font-semibold text-stone-500">Skip or note</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reason (optional)"
            rows={2}
            className="w-full resize-none rounded border border-stone-200 px-2 py-1 text-[11px]"
          />
          <div className="mt-2 flex gap-1">
            <button
              type="button"
              className="flex-1 rounded bg-amber-100 px-2 py-1 text-[10px] font-medium text-amber-900"
              onClick={() => {
                onChange({ completed: false, skipped: true, note: note.trim() || undefined });
                setOpen(false);
              }}
            >
              Skip
            </button>
            <button
              type="button"
              className="flex-1 rounded bg-stone-100 px-2 py-1 text-[10px] font-medium text-stone-700"
              onClick={() => {
                onChange({ completed: false, skipped: false, note: note.trim() || undefined });
                setOpen(false);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
      {(skipped && completion?.note) || note ? (
        <span className="sr-only">{completion?.note ?? note}</span>
      ) : null}
    </div>
  );
};
