type Props = {
  rangeLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onThisWeek: () => void;
};

export const WeekNavigation = ({ rangeLabel, onPrev, onNext, onThisWeek }: Props) => (
  <div className="mb-4 rounded-2xl border border-rose-100 bg-white/80 p-3">
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <button type="button" onClick={onPrev} className="rounded-lg px-2 py-1 hover:bg-rose-50">
        ← Previous Week
      </button>
      <button type="button" onClick={onThisWeek} className="rounded-lg bg-rose-100 px-3 py-1 font-medium text-rose-900">
        🌷 This Week
      </button>
      <button type="button" onClick={onNext} className="rounded-lg px-2 py-1 hover:bg-rose-50">
        Next Week →
      </button>
    </div>
    <p className="mt-2 text-center text-sm text-stone-500">{rangeLabel}</p>
  </div>
);
